# **Exercise 4**: Import Plugin using OpenAPI

### Estimated Duration: 25 minutes

This hands-on lab explores the integration of OpenAPI with Semantic Kernel to enhance AI-driven applications. Designed for developers new to API orchestration, the lab guides you through leveraging OpenAPI specifications to dynamically load external services as plugins. You will learn how to import the provided WorkItems API as an OpenAPI plugin, enabling seamless interaction through AI-driven prompts. By the end of this lab, you will understand how OpenAPI simplifies API integration, reduces manual coding, and enhances the automation of external service calls. Complete all prerequisites before starting, as the cloud-based environment allows you to complete the lab remotely.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Try the app without the Time Plugin

1. Launch your AI Chat app in any of the languange, and submit the following prompt, and see how it responds:
    ```
    What are my work items?
    ```

## Task 2: Create and import the OpenAPI Plugin

<details>
<summary><strong>Python</strong></summary>

1. Right click on `Python>src>workitems` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    python api.py
    ```
    >**Note**:- Please don,t close the `terminal`.
1. You can find the OpenAPI spec in following path `http://127.0.0.1:8000/openapi.json`.
1. Swagger page can be found in `http://127.0.0.1:8000/docs`.
1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `# Placeholder for OpenAPI plugin` section of the file.
    ```
    kernel.add_plugin_from_openapi(
        plugin_name="get_tasks",
        openapi_document_path="http://127.0.0.1:8000/openapi.json",
        execution_settings=OpenAPIFunctionExecutionParameters(
            enable_payload_namespacing=True,
        )
    )
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
        #Challenge 07 - Add DALL-E image generation service
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


        # Challenge 06- Semantic kernel filters

        # Challenge 07 - Text To Image Plugin
        # Placeholder for Text To Image plugin

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
    What are my work items?
    ```
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Right click on `Dotnet>src>Aspire>Aspire.AppHost` in the left pane and select **Open in Integrated Terminal**.
1. Use the following command to run the app:
    ```
    dotnet run
    ```
    >**Note**:- Please don,t close the `terminal`.
1. You can find the OpenAPI spec in following path `http://localhost:5115/swagger/v1/swagger.json`.
1. Swagger page can be found in `http://localhost:5115/swagger/index.html`.
1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **Chat.razor.cs** file.
1. Add the following code in the `// Import Models` section of the file.
    ```
    using Microsoft.SemanticKernel.Plugins.OpenApi;
    ```
1. Add the following code in the `// Challenge 04 - Import OpenAPI Spec` section of the file.
    ```
    await kernel.ImportPluginFromOpenApiAsync(
        pluginName: "todo",
        uri: new Uri("http://localhost:5115/swagger/v1/swagger.json"),
        executionParameters: new OpenApiFunctionExecutionParameters()
        {
            EnablePayloadNamespacing = true
        }
    );
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


            // Challenge 05 - Register Search Index


            // Challenge 07 - Add Azure AI Foundry Text To Image


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

            // Challenge 07 - Text To Image Plugin

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
1. Submit the following prompt an see how the AI responds:
    ```
    What are my work items?
    ```
</details>