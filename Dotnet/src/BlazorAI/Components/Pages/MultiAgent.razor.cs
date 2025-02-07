using Microsoft.AspNetCore.Components;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Agents.Chat;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;


#pragma warning disable SKEXP0110 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

namespace BlazorAI.Components.Pages
{
    public partial class MultiAgent
    {
        private ChatHistory? chatHistory;
        private IChatCompletionService? chatCompletionService;
        private OpenAIPromptExecutionSettings? openAIPromptExecutionSettings;
        private Kernel? kernel;

        [Inject]
        public required IConfiguration Configuration { get; set; }
        [Inject]
        private ILoggerFactory LoggerFactory { get; set; } = null!;

        private List<ChatCompletionAgent> Agents { get; set; } = [];

        private AgentGroupChat AgentGroupChat;


        protected async Task InitializeSemanticKernel()
        {
            chatHistory = [];

            var kernelBuilder = Kernel.CreateBuilder();

            kernelBuilder.AddAzureOpenAIChatCompletion(
                Configuration["AOI_DEPLOYMODEL"] ?? "gpt-35-turbo",
                Configuration["AOI_ENDPOINT"]!,
                Configuration["AOI_API_KEY"]!);

            kernelBuilder.Services.AddSingleton(LoggerFactory);

            kernel = kernelBuilder.Build();

            await CreateAgents();

            // create Agent Group Chat [AgentGroupChat]

        }

        private async Task CreateAgents()
        {
            // Create a Business Analyst Agent [ChatCompletionAgent] and add it to the Agents List.
            // ChatCompletionAgent takes Instructions, a Name (No Spaces allowed), and the Kernel.

            // Create a Software Engineer Agent [ChatCompletionAgent] and add it to the Agents List.
            // ChatCompletionAgent takes Instructions, a Name (No Spaces allowed), and the Kernel.

            // Create a Product Owner Agent [ChatCompletionAgent] and add it to the Agents List.
            // ChatCompletionAgent takes Instructions, a Name (No Spaces allowed), and the Kernel.

        }

        private async Task AddPlugins()
        {

        }

        private async Task SendMessage()
        {
            // Copy the message from the user input - just like in Chat.razor.cs
            var userMessage = MessageInput;
            MessageInput = string.Empty;
            loading = true;
            chatHistory.AddUserMessage(userMessage);
            StateHasChanged();

            // Add a new ChatMessageContent to the AgentGroupChat with the User role, and userMessage contents

            try
            {
                // Use async foreach to iterate over the messages from the AgentGroupChat

                // Add each message to the chatHistory

            }
            catch (Exception e)
            {
                logger.LogError(e, "Error while trying to send message to agents.");
            }
            loading = false;
        }
    }

    sealed class ApprovalTerminationStrategy : TerminationStrategy
    {
        // Setup your ApprovalTerminationStrategy here
        // Use the history[^1].Content property to check if the message contains the token
        // you are looking for. Return true if the token is found, false otherwise.
        protected override Task<bool> ShouldAgentTerminateAsync(Agent agent, IReadOnlyList<ChatMessageContent> history, CancellationToken cancellationToken = default)
            => throw new NotImplementedException();
    }
}
