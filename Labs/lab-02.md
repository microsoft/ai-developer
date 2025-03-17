# **Exercise 2**: Semantic Kernel Fundamentals

### Estimated Duration: 60 minutes

In this challenge, you will be provided with a starter application that will require you to complete the implementation of the chat feature using Semantic Kernel and the Azure AI Foundry GPT-4o model. The AI model will then respond with an answer or completion to the prompt. The application uses the Semantic Kernel framework to interact with the AI model. You will need to complete the implementation of the chat API to send the user's prompt to the AI model and return the response to the user.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Setup Azure AI Foundry

1. Open **Visual Stuido code** from the desktop shortcut in the labvm.
1. Click on **File** and select **Open Folder**.
1. Navigate to `C:\LabFiles` and select **ai-developer** folder and click on **Select Folder**.
1. If you recieve `Do you trust the authors of the files in folder` warning, select the checkbox and click on **Yes, I trust the authors**.

## Task 2: Setup environment variables
<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **.env** file.
1. Navigate to AI Foundry Portal and on Overview page select Azure OpenAI Service and copy the endpoint.
1. Paste it besides `AZURE_OPENAI_ENDPOINT`.
    >Note:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.
1. Copy the API key from AI Foundry Portal and paste it besides `AZURE_OPENAI_API_KEY`.
1. Save the file.

</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to `Dotnet>src>BlazorAI` directory and open **appsettings.json** file.
1. Navigate to AI Foundry Portal and on Overview page select Azure OpenAI Sercie and copy the endpoint.
1. Paste it besides `AOI_ENDPOINT`.
    >**Note**:- Ensure that every value in the **.env** file is enclosed in **double quotes (")**.

    >**Note**:- Make sure to remove the "/" from the endpoint.
1. Copy the API key from AI Foundry Portal and paste it besides `AOI_API_KEY`.
1. Save the file.

</details>

## Task 3: Update the code files and run the app

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **chat.py** file.
1. Add the following code in the `#Import Modules` section of the file.
    ```
    from semantic_kernel.connectors.ai.chat_completion_client_base import ChatCompletionClientBase
    from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
    import os
    ```
1. Add the following code in the `# Challenge 02 - Chat Completion Service` section of the file.
    ```
    chat_completion_service = AzureChatCompletion(
        deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        service_id="chat-service",
    )
    kernel.add_service(chat_completion_service)
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
    ```
1. Add the following code in the `# Start Challenge 02 - Sending a message to the chat completion service by invoking kernel` section of the file.
    ```
    global chat_history
    chat_history.add_user_message(user_input)
    chat_completion = kernel.get_service(type=ChatCompletionClientBase)
    execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
    response = await chat_completion.get_chat_message_content(
        chat_history=chat_history,
        settings=execution_settings,
        kernel=kernel
    )
    chat_history.add_assistant_message(str(response))
    ```
1. Add the following code in the `#return result` section of the file.
    ```
    logger.info(f"Response: {response}")
    return response
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
        execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
        #Challenge 05 - Add Text Embedding service for semantic search
        #Challenge 07 - Add DALL-E image generation service
        chat_completion_service = kernel.get_service(type=ChatCompletionClientBase)
        return kernel


    async def process_message(user_input):
        kernel = initialize_kernel()

        #Challenge 03 and 04 - Services Required
        #Challenge 03 - Create Prompt Execution Settings



        # Challenge 03 - Add Time Plugin
        # Placeholder for Time plugin

        # Challenge 04 - Import OpenAPI Spec
        # Placeholder for OpenAPI plugin


        # Challenge 05 - Add Search Plugin


        # Challenge 06- Semantic kernel filters

        # Challenge 07 - Text To Image Plugin
        # Placeholder for Text To Image plugin

        # Start Challenge 02 - Sending a message to the chat completion service by invoking kernel
        global chat_history
        chat_history.add_user_message(user_input)
        chat_completion = kernel.get_service(type=ChatCompletionClientBase)
        execution_settings = kernel.get_prompt_execution_settings_from_service_id("chat-service")
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
1. If you are asked for any email to register, feel free to use the below provided email:
    ```
    test@gmail.com
    ```
1. If the app does not open automatically in the browser, you can access it using the following **URL**:
    ```
    http://localhost:8501
    ```
1. Submit the following prompt and see how the AI responds:
    ```
    Why is the sky blue?
    ```
    ```
    Why is it red?
    ```
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **Chat.razor.cs** file.
1. Add the following code in the `// Your code goes here(Line no. 91)` section of the file.
    ```
    chatHistory.AddUserMessage(userMessage);
    var chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
    var assistantResponse = await chatCompletionService.GetChatMessageContentAsync(
        chatHistory: chatHistory,
        executionSettings: promptSettings,
        kernel: kernel);
    chatHistory.AddAssistantMessage(assistantResponse.Content);
    ```
1. In case you encounter any indentation error, use the below code:
    ```
    using Microsoft.AspNetCore.Components;
    using Microsoft.SemanticKernel;
    using Microsoft.SemanticKernel.ChatCompletion;

    #pragma warning disable SKEXP0040 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    #pragma warning disable SKEXP0020 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    #pragma warning disable SKEXP0010 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
    #pragma warning disable SKEXP0001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

    namespace BlazorAI.Components.Pages;

    public partial class Chat
    {
        private ChatHistory? chatHistory;
        private Kernel? kernel;

        [Inject]
        public required IConfiguration Configuration { get; set; }
        [Inject]
        private ILoggerFactory LoggerFactory { get; set; } = null!;

        protected async Task InitializeSemanticKernel()
        {
            chatHistory = [];

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


        }


        private async Task AddPlugins()
        {
            // Challenge 03 - Add Time Plugin

            // Challenge 04 - Import OpenAPI Spec

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
1. Run the following line of code to trust the dev-certificates neccessary to run the app locally, and then select on **Yes**:
    ```
    dotnet dev-certs https --trust
    ```
1. Use the following command to run the app:
    ```
    dotnet run
    ```
1. Navigate to the link that is in the output section of the terminal:
    >**Note**: The link can be found besides **Login to the dashboard at** in the terminal.

    >**Note**: If you recieve security warnings in the browser, close the browser and follow the link again.
1. Navigate to the link pointing towards **blazor-aichat** i.e **https://localhost:7118/**

</details>