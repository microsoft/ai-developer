# **Exercise 7**: Image Generation using DALL-E

### Estimated Duration: 25 minutes

This hands-on lab introduces image generation capabilities to your reference application using DALL·E, an advanced AI model that transforms text into visuals. Designed for those new to AI-powered creativity, the lab guides you step-by-step in integrating DALL·E to generate images from descriptive text prompts. You will explore how DALL·E can create visuals ranging from realistic objects and scenes to imaginative, abstract concepts—unlocking new possibilities for creative expression and user interaction. Complete all prerequisites before starting, as the cloud-based environment enables you to complete the lab remotely.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Deploy a DALL-E model
1. Navigate to [Azure AI Foundry](https://ai.azure.com/) portal.
1.  Click on **Models + endpoints** under **My assets** in the left pane.
1.  Click on **+ Deploy model**, and then select **Deploy Base model**.
1. Search for **dall-e-3**, select the model and click on **Confirm**.
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
1. In case you encounter any indentation error, use the below code:
    ```
    import asyncio
    import logging
    from dotenv import load_dotenv
    from semantic_kernel import Kernel
    from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion, OpenAITextToImage
    from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
    from semantic_kernel.connectors.openapi_plugin import OpenAPIFunctionExecutionParameters
    from semantic_kernel.contents.chat_history import ChatHistory
    from semantic_kernel.functions import KernelArguments
    #Import Modules
    from semantic_kernel.connectors.ai.chat_completion_client_base import ChatCompletionClientBase
    from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
    import os
    from semantic_kernel.connectors.ai.open_ai.prompt_execution_settings.azure_chat_prompt_execution_settings import (
        AzureChatPromptExecutionSettings,
    )
    from plugins.time_plugin import TimePlugin
    from plugins.geo_coding_plugin import GeoPlugin
    from plugins.weather_plugin import WeatherPlugin
    from semantic_kernel.connectors.ai.open_ai import AzureTextEmbedding
    from plugins.ContosoSearchPlugin import ContosoSearchPlugin
    from plugins.ImageGenerationPlugin import ImageGenerationPlugin
    from semantic_kernel.connectors.ai.open_ai import AzureTextToImage


    #Add Logger
    logger = logging.getLogger(__name__)

    load_dotenv(override=True)

    chat_history = ChatHistory()

    def initialize_kernel():
    #Challene 02 - Add Kernel
        kernel = Kernel()
        #Challenge 02 - Chat Completion Service
        chat_completion_service = AzureChatCompletion(
            deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            service_id="chat-service",
        )
        kernel.add_service(chat_completion_service)
        #Challenge 05 - Add Text Embedding service for semantic search
        text_embedding_service = AzureTextEmbedding(
            deployment_name=os.getenv("AZURE_OPENAI_EMBED_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            service_id="embedding-service"
        )
        kernel.add_service(text_embedding_service)
        logger.info("Text Embedding service added")
        #Challenge 07 - Add DALL-E image generation service
        image_generation_service = AzureTextToImage(
            deployment_name=os.getenv("AZURE_TEXT_TO_IMAGE_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_TEXT_TO_IMAGE_API_KEY"),
            endpoint=os.getenv("AZURE_TEXT_TO_IMAGE_ENDPOINT"),
            service_id="image-service"
        )
        kernel.add_service(image_generation_service)
        logger.info("DALL-E image generation service added")
        chat_completion_service = kernel.get_service(type=ChatCompletionClientBase)
        return kernel


    async def process_message(user_input):
        kernel = initialize_kernel()

        #Challenge 03 and 04 - Services Required
        #Challenge 03 - Create Prompt Execution Settings
        execution_settings = AzureChatPromptExecutionSettings()
        execution_settings.function_choice_behavior = FunctionChoiceBehavior.Auto()
        logger.info("Automatic function calling enabled")



        # Challenge 03 - Add Time Plugin
        # Placeholder for Time plugin
        time_plugin = TimePlugin()
        kernel.add_plugin(time_plugin, plugin_name="TimePlugin")
        logger.info("Time plugin loaded")

        kernel.add_plugin(
            GeoPlugin(),
            plugin_name="GeoLocation",
        )
        logger.info("GeoLocation plugin loaded")

        kernel.add_plugin(
            WeatherPlugin(),
            plugin_name="Weather",
        )
        logger.info("Weather plugin loaded")

        # Challenge 04 - Import OpenAPI Spec
        # Placeholder for OpenAPI plugin
        kernel.add_plugin_from_openapi(
            plugin_name="get_tasks",
            openapi_document_path="http://127.0.0.1:8000/openapi.json",
            execution_settings=OpenAPIFunctionExecutionParameters(
                enable_payload_namespacing=True,
            )
        )


        # Challenge 05 - Add Search Plugin
        kernel.add_plugin(
            ContosoSearchPlugin(),
            plugin_name="ContosoSearch",
        )
        logger.info("Contoso Handbook Search plugin loaded")

        # Challenge 06- Semantic kernel filters

        # Challenge 07 - Text To Image Plugin
        # Placeholder for Text To Image plugin
        image_plugin = ImageGenerationPlugin()
        image_plugin.set_kernel(kernel)
        kernel.add_plugin(
            image_plugin,
            plugin_name="ImageGeneration",
        )
        logger.info("Image Generation plugin loaded")

        # Start Challenge 02 - Sending a message to the chat completion service by invoking kernel
        global chat_history
        chat_history.add_user_message(user_input)
        chat_completion = kernel.get_service(type=ChatCompletionClientBase)
        response = await chat_completion.get_chat_message_content(
            chat_history=chat_history,
            settings=execution_settings,
            kernel=kernel
        )
        chat_history.add_assistant_message(str(response))

            #return result
        logger.info(f"Response: {response}")
        return response

    def reset_chat_history():
        global chat_history
        chat_history = ChatHistory()
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
1. In case you encounter any indentation error, use the below code:
    ```
    using Microsoft.AspNetCore.Components;
    using Microsoft.SemanticKernel;
    using Microsoft.SemanticKernel.ChatCompletion;
    // Import Models
    using Microsoft.SemanticKernel.Connectors.OpenAI;
    using BlazorAI.Plugins;
    using System;
    using Microsoft.SemanticKernel.Plugins.OpenApi;
    using Microsoft.SemanticKernel.Connectors.AzureAISearch;
    using Azure;
    using Azure.Search.Documents.Indexes;
    using Microsoft.Extensions.DependencyInjection;
    #pragma warning disable SKEXP0040 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    #pragma warning disable SKEXP0020 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    #pragma warning disable SKEXP0010 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    #pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

    namespace BlazorAI.Components.Pages;

    public partial class Chat
    {
        private ChatHistory? chatHistory;
        private Kernel? kernel;
        private OpenAIPromptExecutionSettings? promptSettings;

        [Inject]
        public required IConfiguration Configuration { get; set; }
        [Inject]
        private ILoggerFactory LoggerFactory { get; set; } = null!;

        protected async Task InitializeSemanticKernel()
        {
            chatHistory = [];
            chatHistory = new ChatHistory();

            // Challenge 02 - Configure Semantic Kernel
            var kernelBuilder = Kernel.CreateBuilder();

            // Challenge 02 - Add OpenAI Chat Completion
            kernelBuilder.AddAzureOpenAIChatCompletion(
                Configuration["AOI_DEPLOYMODEL"]!,
                Configuration["AOI_ENDPOINT"]!,
                Configuration["AOI_API_KEY"]!);

            // Add Logger for Kernel
            kernelBuilder.Services.AddSingleton(LoggerFactory);

            // Challenge 03 and 04 - Services Required
            kernelBuilder.Services.AddHttpClient();

            // Challenge 05 - Register Azure AI Foundry Text Embeddings Generation
            kernelBuilder.AddAzureOpenAITextEmbeddingGeneration(
                Configuration["EMBEDDINGS_DEPLOYMODEL"]!,
                Configuration["AOI_ENDPOINT"]!,
                Configuration["AOI_API_KEY"]!);


            // Challenge 05 - Register Search Index
            kernelBuilder.Services.AddSingleton<SearchIndexClient>(sp => 
                new SearchIndexClient(
                    new Uri(Configuration["AI_SEARCH_URL"]!), 
                    new AzureKeyCredential(Configuration["AI_SEARCH_KEY"]!)
                )
            );

            kernelBuilder.Services.AddSingleton<AzureAISearchVectorStoreRecordCollection<Dictionary<string, object>>>(sp =>
            {
                var searchIndexClient = sp.GetRequiredService<SearchIndexClient>();
                return new AzureAISearchVectorStoreRecordCollection<Dictionary<string, object>>(
                    searchIndexClient,
                    "employeehandbook"
                );
            });

            kernelBuilder.AddAzureAISearchVectorStore();


            // Challenge 07 - Add Azure AI Foundry Text To Image
            kernelBuilder.AddAzureOpenAITextToImage(
                Configuration["DALLE_DEPLOYMODEL"]!,
                Configuration["AOI_ENDPOINT"]!,
                Configuration["AOI_API_KEY"]!);

            // Challenge 02 - Finalize Kernel Builder
            kernel = kernelBuilder.Build();

            // Challenge 03, 04, 05, & 07 - Add Plugins
            await AddPlugins();

            // Challenge 02 - Chat Completion Service


            // Challenge 03 - Create OpenAIPromptExecutionSettings
            promptSettings = new OpenAIPromptExecutionSettings
            {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
                Temperature = 0.7,
                TopP = 0.95,
                MaxTokens = 800
            };


        }


        private async Task AddPlugins()
        {
            // Challenge 03 - Add Time Plugin
            var timePlugin = new Plugins.TimePlugin();
            kernel.ImportPluginFromObject(timePlugin, "TimePlugin");
            
            var geocodingPlugin = new GeocodingPlugin(
                kernel.Services.GetRequiredService<IHttpClientFactory>(), 
                Configuration);
            kernel.ImportPluginFromObject(geocodingPlugin, "GeocodingPlugin");

            var weatherPlugin = new WeatherPlugin(
                kernel.Services.GetRequiredService<IHttpClientFactory>());
                kernel.ImportPluginFromObject(weatherPlugin, "WeatherPlugin");

            // Challenge 04 - Import OpenAPI Spec
            await kernel.ImportPluginFromOpenApiAsync(
                pluginName: "todo",
                uri: new Uri("http://localhost:5115/swagger/v1/swagger.json"),
                executionParameters: new OpenApiFunctionExecutionParameters()
                {
                    EnablePayloadNamespacing = true
                }
            );

            // Challenge 05 - Add Search Plugin
            var searchPlugin = new ContosoSearchPlugin(Configuration);
            kernel.ImportPluginFromObject(searchPlugin, "HandbookPlugin");

            // Challenge 07 - Text To Image Plugin
            var imageGenerationPlugin = new ImageGenerationPlugin(Configuration);
            kernel.ImportPluginFromObject(imageGenerationPlugin, "ImagePlugin");

        }

        private async Task SendMessage()
        {
            if (!string.IsNullOrWhiteSpace(newMessage) && chatHistory != null)
            {
                // This tells Blazor the UI is going to be updated.
                StateHasChanged();
                loading = true;
                // Copy the user message to a local variable and clear the newMessage field in the UI
                var userMessage = newMessage;
                newMessage = string.Empty;
                StateHasChanged();

                // Start Challenge 02 - Sending a message to the chat completion service

                chatHistory.AddUserMessage(userMessage);
                var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
                var assistantResponse = await chatCompletionService.GetChatMessageContentAsync(
                    chatHistory: chatHistory,
                    executionSettings: promptSettings,
                    kernel: kernel);
                chatHistory.AddAssistantMessage(assistantResponse.Content);

                // End Challenge 02 - Sending a message to the chat completion service

                loading = false;
            }
        }
    }
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
