# **Exercise 7**: Image Generation using DALL-E

### Estimated Duration: 25 minutes

This hands-on lab introduces image generation capabilities to your reference application using DALL·E, an advanced AI model that transforms text into visuals. Designed for those new to AI-powered creativity, the lab guides you step-by-step in integrating DALL·E to generate images from descriptive text prompts. You will explore how DALL·E can create visuals ranging from realistic objects and scenes to imaginative, abstract concepts—unlocking new possibilities for creative expression and user interaction. Complete all prerequisites before starting, as the cloud-based environment enables you to complete the lab remotely.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Deploy a DALL-E model
1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1. Click on **Models + endpoints (1)** under **My assets** in the left pane and then click on **+ Deploy model**, followed by **Deploy Base model (2)**.

    ![](./media/image_007-1.png)
1. Search for **dall-e-3 (1)**, select the model (2) and click on **Confirm (3)**.

    ![](./media/image_110.png)
1. Click on **Deploy**.

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **.env** file.
1. Navigate to AI Foundry Portal and on **dall-e-3** page, copy the **Target URI**.
1. Paste it besides `AZURE_TEXT_TO_IMAGE_ENDPOINT`.
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Copy the API key from AI Foundry Portal and paste it besides `AZURE_TEXT_TO_IMAGE_API_KEY`.
1. Save the file.
</details>

## Task 2: Create and import the Image Generation Plugin
<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src>plugins` directory and create a new file named **ImageGenerationPlugin.py**.
1. Add the following code in the file:

    ```
    import os
    import json
    from typing import Annotated
    from semantic_kernel.functions import kernel_function, KernelFunction
    from semantic_kernel.kernel import Kernel
    import httpx
    from PIL import Image

    class ImageGenerationPlugin:
        """Plugin for generating images using DALL-E."""

        def __init__(self):
            """Initialize the ImageGenerationPlugin."""
            self._kernel = None

        # This method will be called by Semantic Kernel when the plugin is registered
        def set_kernel(self, kernel):
            self._kernel = kernel

        @kernel_function(
            description="Generates an image based on the text prompt",
            name="generate_image"
        )
        async def generate_image(
            self, 
            prompt: Annotated[str, "Text description of the image to generate"],
            size: Annotated[str, "Size of the image (default: 1024x1024)"] = "1024x1024",
            kernel=None  # Allow kernel to be passed as a parameter
        ) -> str:
            """
            Generate an image using DALL-E based on the provided text prompt.
            Returns the URL of the generated image.
            """
            try:
                # Use the provided kernel or the stored one
                kernel_to_use = kernel or self._kernel
                if not kernel_to_use:
                    return "Error: No kernel available to the plugin"
                    
                # Get the image service - use correct method name
                try:
                    image_service = kernel_to_use.get_service(service_id="image-service")
                except Exception as e:
                    return f"Error accessing image service: {str(e)}"

                print(f"Generating image with prompt: {prompt}")
                
                # Parse size (format like "1024x1024")
                if "x" in size:
                    width, height = map(int, size.split('x'))
                else:
                    # Default to square if size format is incorrect
                    width = height = 1024
                
                # Generate the image with correct parameter names
                result = await image_service.generate_image(
                    description=prompt,  # Using prompt as the description
                    width=width,
                    height=height
                )

                image_dir = os.path.join(os.curdir, 'images')

                # If the directory doesn't exist, create it
                if not os.path.isdir(image_dir):
                    os.mkdir(image_dir)

                # Properly handle the result based on its type
                try:
                    # For newer SDK versions that return a string
                    if isinstance(result, str):
                        print(f"Result is a string: {result}")
                        json_response = json.loads(result)
                    # For older SDK versions that return an object with model_dump_json
                    else:
                        print(f"Result is an object with type: {type(result)}")
                        json_response = json.loads(result.model_dump_json())
                    
                    print(f"API Response: {json_response}")
                    
                    image_url = json_response["data"][0]["url"]  # extract image URL from response
                    return image_url
                    
                except Exception as e:
                    # If we can't parse the response properly, log it and return it as-is
                    print(f"Error processing image response: {str(e)}")
                    print(f"Raw response: {result}")
                    
                    # If the result is already the URL, return it directly
                    if isinstance(result, str) and result.startswith("http"):
                        return result
                            
                    return f"Image response received but couldn't process it: {result}"

            except Exception as e:
                import traceback
                error_details = traceback.format_exc()
                print(f"Error generating image: {str(e)}\n{error_details}")
                return f"Error generating image: {str(e)}"
    ```
1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `#Import Modules` section of the file.
    ```
    from plugins.ImageGenerationPlugin import ImageGenerationPlugin
    from semantic_kernel.connectors.ai.open_ai import AzureTextToImage
    ```
1. Add the following code in the `#Challenge 07 - Add DALL-E image generation service` section of the file.
    ```
    image_generation_service = AzureTextToImage(
        deployment_name=os.getenv("AZURE_TEXT_TO_IMAGE_DEPLOYMENT_NAME"),
        api_key=os.getenv("AZURE_TEXT_TO_IMAGE_API_KEY"),
        endpoint=os.getenv("AZURE_TEXT_TO_IMAGE_ENDPOINT"),
        service_id="image-service"
    )
    kernel.add_service(image_generation_service)
    ```
1. Add the following code in the `# Placeholder for Text To Image plugin` section of the file.
    ```
    image_plugin = ImageGenerationPlugin()
    image_plugin.set_kernel(kernel)
    kernel.add_plugin(
        image_plugin,
        plugin_name="ImageGeneration",
    )
    logger.info("Image Generation plugin loaded")
    ```
1. In case you encounter any indentation error, use the code from the following URL:
    ```
    https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/python/lab-07.py
    ```
1. Save the file.
1. Right click on `Python>src` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    streamlit run app.py
    ```
1. If the app does not open automatically in the browser, you can access it using the following **URL**:
    ```
    http://localhost:8501
    ```
1. Submit the following prompt and see how the AI responds:
    ```
    Create a picture of a cute kitten wearing a hat.
    ```
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to `Dotnet>src>BlazorAI>Plugins` directory and create a new file named **ImageGenerationPlugin.cs**.
1. Add the following code in the file:
    ```
    using System;
    using System.ComponentModel;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.SemanticKernel;
    using Microsoft.SemanticKernel.TextToImage;
    using Microsoft.Extensions.Logging;
    using System.Text.Json;
    using System.Net.Http;
    using System.Text.RegularExpressions;

    namespace BlazorAI.Plugins
    {
        public class ImageGenerationPlugin
        {
            private readonly IConfiguration _configuration;
            private ILogger<ImageGenerationPlugin> _logger;
            private readonly HttpClient _httpClient;

            public ImageGenerationPlugin(IConfiguration configuration)
            {
                _configuration = configuration;
                _httpClient = new HttpClient();
            }

            [KernelFunction("GenerateImage")]
            [Description("Generates an image based on a text description. Use this when the user wants to create, draw, or visualize an image.")]
            public async Task<string> GenerateImage(
                [Description("Detailed description of the image to generate")] string prompt,
                [Description("Size of the image (e.g., '1024x1024', '512x512')")] string size = "1024x1024",
                Kernel kernel = null)
            {
                try
                {
                    _logger = kernel?.GetRequiredService<ILoggerFactory>()?.CreateLogger<ImageGenerationPlugin>();
                    _logger?.LogInformation($"Generating image with prompt: {prompt}, size: {size}");

                    var imageService = kernel.GetRequiredService<ITextToImageService>();
                    
                    int width = 1024;
                    int height = 1024;
                    
                    if (size != null && size.Contains("x"))
                    {
                        var dimensions = size.Split('x');
                        if (dimensions.Length == 2 && 
                            int.TryParse(dimensions[0], out int parsedWidth) && 
                            int.TryParse(dimensions[1], out int parsedHeight))
                        {
                            width = parsedWidth;
                            height = parsedHeight;
                        }
                        else
                        {
                            _logger?.LogWarning($"Invalid size format: {size}. Using default 1024x1024.");
                        }
                    }

                    string resultString = await imageService.GenerateImageAsync(prompt, width, height, kernel);
                    
                    string fileName = $"generated_{Guid.NewGuid()}.png";
                    string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                    
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }
                    
                    string filePath = Path.Combine(directoryPath, fileName);
                    
                    byte[] imageBytes;
                    
                    if (Uri.IsWellFormedUriString(resultString, UriKind.Absolute))
                    {
                        return $"![Generated image based on prompt: '{prompt}']({resultString})";
                    }
                    else if (resultString.StartsWith("data:image"))
                    {
                        var base64Data = resultString.Substring(resultString.IndexOf(',') + 1);
                        imageBytes = Convert.FromBase64String(base64Data);
                    }
                    else if (Regex.IsMatch(resultString, @"^[A-Za-z0-9+/]*={0,2}$"))
                    {
                        imageBytes = Convert.FromBase64String(resultString);
                    }
                    else
                    {
                        throw new InvalidOperationException($"Unexpected string format returned from image generation: {resultString.Substring(0, Math.Min(100, resultString.Length))}...");
                    }
                    
                    await File.WriteAllBytesAsync(filePath, imageBytes);
                    
                    return $"![Generated image based on prompt: '{prompt}'](/images/{fileName})";
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, $"Error generating image: {ex.Message}");
                    return $"Error generating image: {ex.Message}";
                }
            }
        }
    }
    ```
1. Save the file.
1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **Chat.razor.cs** file.
1. Add the following code in the `// Challenge 07 - Add Azure AI Foundry Text To Image` section of the file.
    ```
    kernelBuilder.AddAzureOpenAITextToImage(
        Configuration["DALLE_DEPLOYMODEL"]!,
        Configuration["AOI_ENDPOINT"]!,
        Configuration["AOI_API_KEY"]!);
    ```
1. Add the following code in the `// Challenge 07 - Text To Image Plugin` section of the file.
    ```
    var imageGenerationPlugin = new ImageGenerationPlugin(Configuration);
    kernel.ImportPluginFromObject(imageGenerationPlugin, "ImagePlugin");
    ```
1. In case you encounter any indentation error, use the code from the following URL:
    ```
    https://raw.githubusercontent.com/CloudLabsAI-Azure/ai-developer/refs/heads/prod/CodeBase/c%23/lab-07.cs
    ```
1. Save the file.
1. Right click on `Dotnet>src>Aspire>Aspire.AppHost` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    dotnet run
    ```
1. Navigate to the link that is in the output section of the terminal:
    >**Note**: The link can be found besides **Login to the dashboard at** in the terminal.

    >**Note**: If you recieve security warnings in the browser, close the browser and follow the link again.
1. Navigate to the link pointing towards **blazor-aichat** i.e **https://localhost:7118/**
1. Submit the following prompt and see how the AI responds:
    ```
    Create a picture of a cute kitten wearing a hat.
    ```
</details>

## Summary

In this exercise, we integrated **DALL·E** into a reference application to enable **AI-powered image generation** from text prompts. We explored how DALL·E transforms descriptive inputs into visuals—ranging from realistic scenes to abstract concepts—unlocking new creative possibilities. This enhanced our proficiency in applying generative AI for visual content creation and user interaction.