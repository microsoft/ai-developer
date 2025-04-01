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

            // Your code goes here
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
