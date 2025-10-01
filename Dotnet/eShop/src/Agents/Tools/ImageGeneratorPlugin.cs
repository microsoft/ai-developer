using System.ComponentModel;
using System.Net;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.TextToImage;

namespace Agents.Tools
{
    public class ImageGeneratorPlugin
    {
        private readonly ITextToImageService _dalle;
        private readonly ILogger _logger;
        private readonly BlobServiceClient _blobClient;

        public ImageGeneratorPlugin(Kernel kernel, BlobServiceClient blobClient, ILogger<ImageGeneratorPlugin> logger)
        {
            _dalle = kernel.GetRequiredService<ITextToImageService>();
            _logger = logger;
            _blobClient = blobClient;
        }

        [KernelFunction, Description("Returns a url for an image from a text description. If there are issues, the response will contain reasoning for why the image was not generated.")]
        public async Task<string> GenerateImage([Description("Descriptive prompt optimized for DALL-E")] string imageDescription)
        {
            const int maxRetries = 5;
            const int initialDelayMilliseconds = 500;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    // Attempt to generate the image  
                    var imageUrl = await _dalle.GenerateImageAsync(imageDescription, 1024, 1024);

                    // Download the image from the URL
                    using var httpClient = new HttpClient();
                    var imageData = await httpClient.GetByteArrayAsync(imageUrl);

                    // Get or create the images container
                    var containerClient = _blobClient.GetBlobContainerClient("images");
                    await containerClient.CreateIfNotExistsAsync();

                    // Generate unique blob name
                    string blobName = $"{Guid.NewGuid()}.png";
                    var blobClient = containerClient.GetBlobClient(blobName);

                    // Upload the image to blob storage
                    using var stream = new MemoryStream(imageData);
                    await blobClient.UploadAsync(stream, overwrite: true);

                    _logger.LogInformation("Image uploaded successfully to blob storage with name: {BlobName}", blobName);

                    // Return the URL to the blob
                    return blobClient.Uri.ToString();
                }
                catch (HttpOperationException httpOpEx)
                {
                    if (httpOpEx.Message.Contains("This request has been blocked by our content filters"))
                    {
                        _logger.LogWarning(httpOpEx, "Image blocked due to content filter. Letting the AI Agent know.");
                        return $"The image you attempted to generate was flagged for improper content. Please adjust your prompt and try again.";
                    }

                    if (httpOpEx.StatusCode == HttpStatusCode.TooManyRequests)
                    {
                        // Parse backoff timer from the exception message  
                        var retryAfterMatch = System.Text.RegularExpressions.Regex.Match(httpOpEx.Message, @"Try again in (\d+) seconds");
                        var backoffDelay = retryAfterMatch.Success
                            ? int.Parse(retryAfterMatch.Groups[1].Value) * 1000
                            : initialDelayMilliseconds * (int)Math.Pow(2, attempt - 1);

                        _logger.LogWarning("Too many requests. Applying backoff delay of {BackoffDelay}ms.", backoffDelay);
                        await Task.Delay(backoffDelay);
                    }
                    else
                    {
                        // Log the transient error and apply exponential backoff  
                        _logger.LogWarning(httpOpEx, "Transient error on attempt {Attempt}. Retrying after delay...", attempt);
                        await Task.Delay(initialDelayMilliseconds * (int)Math.Pow(2, attempt - 1));
                    }
                }
                catch (HttpRequestException httpEx) when (attempt < maxRetries)
                {
                    // Log the transient error and apply exponential backoff  
                    if (httpEx.Message.Contains("This request has been blocked by our content filters"))
                    {
                        _logger.LogWarning(httpEx, "Image blocked due to content filter. Letting the AI Agent know.");
                        return
                            $"The image you attempted to generate was flagged for improper content. Please adjust your prompt and try again.";
                    }

                    if (httpEx.StatusCode == HttpStatusCode.TooManyRequests)
                    {
                        // Apply custom backoff algorithm  
                        var retryAfterMatch = System.Text.RegularExpressions.Regex.Match(httpEx.Message, @"Try again in (\d+) seconds");
                        int backoffDelay = retryAfterMatch.Success
                            ? int.Parse(retryAfterMatch.Groups[1].Value) * 1000
                            : initialDelayMilliseconds * (int)Math.Pow(2, attempt - 1);

                        _logger.LogWarning("Too many requests. Applying backoff delay of {BackoffDelay}ms.", backoffDelay);
                        await Task.Delay(backoffDelay);
                    }
                    else
                    {
                        _logger.LogWarning(httpEx, "Transient error on attempt {Attempt}. Retrying after delay...", attempt);
                        await Task.Delay(initialDelayMilliseconds * (int)Math.Pow(2, attempt - 1));
                    }
                }
                catch (Exception ex)
                {
                    // Log and rethrow for non-transient errors or after max retries  
                    _logger.LogError(ex, "Error while trying to generate an image on attempt {Attempt}", attempt);
                    if (attempt == maxRetries)
                    {
                        return $"Error while trying to generate an image: {ex.Message}";
                    }
                }
            }

            // Fallback in case all retries fail  
            return "Error: Unable to generate image after multiple attempts.";
        }
    }
}
