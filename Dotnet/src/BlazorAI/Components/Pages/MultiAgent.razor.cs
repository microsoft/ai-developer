using BlazorAI.Queue;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.JSInterop;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.SemanticKernel.Agents.Magentic;
using Microsoft.SemanticKernel.Agents.Orchestration;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.Agents.Runtime.InProcess;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using System;


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
        private IBackgroundTaskQueue _backgroundTaskQueue { get; set; } = null!;

        private List<Agent> Agents { get; set; } = [];

        private MagenticOrchestration? orchestration;


        protected void InitializeSemanticKernel()
        {
            chatHistory = [];

            var kernelBuilder = Kernel.CreateBuilder();

            kernelBuilder.AddAzureOpenAIChatCompletion(
                Configuration["AOI_DEPLOYMODEL"] ?? "gpt-35-turbo",
                Configuration["AOI_ENDPOINT"]!,
                Configuration["AOI_API_KEY"]!);

            kernelBuilder.Services.AddSingleton(LoggerFactory);

            kernel = kernelBuilder.Build();

            AddPlugins();

            CreateAgents();

            // Implement the orchestration using Magentic below

            
            // Verify we have agents before proceeding
            if (Agents.Count == 0)
            {
                throw new InvalidOperationException("No agents were created. Check agent creation logic.");
            }

        }

        private void CreateAgents()
        {
            if (kernel is null)
            {
                throw new InvalidOperationException("Kernel must be initialized before creating agents.");
            }
            
            // Clear existing agents
            Agents.Clear();

            // Append the agents to the Agents list
            // Create a Business Analyst Agent


            // Create a Software Engineer Agent


            // Create a Product Owner Agent

        }

        private void AddPlugins()
        {

        }

        // Implement the callback to handle agent responses
        private async ValueTask ResponseCallback(ChatMessageContent response)
        {
            // Imlement the logic to handle the response from the agents




            // This is used to update the UI with the new message
            await InvokeAsync(StateHasChanged);

        }

        private async Task SendMessage()
        {
            if (orchestration is null)
            {
                throw new InvalidOperationException("The 'orchestration' field must be initialized before sending messages.");
            }

            // Copy the message from the user input - just like in Chat.razor.cs
            // This code grouping is used to handle the user input message and update the UI accordingly
            var userMessage = MessageInput;
            MessageInput = string.Empty;
            loading = true;
            // While the agent orchestration has its own chat history, we also maintain a local chat history for UI updates
            chatHistory!.AddUserMessage(userMessage);
            StateHasChanged();

            // Use the injected _backgroundTaskQueue instance to queue the background chat orchestration task
            // This allows the UI to remain responsive while the orchestration runs in the background
            await _backgroundTaskQueue.QueueBackgroundWorkItemAsync(async token =>
            {
                // Implement the runtime

                try
                {
                    // Create a prompt for the orchestration, including the user message


                    // Invoke the orchestration with the prompt and runtime.
                    // Note the timeout is set to 600 seconds (10 minutes) to allow for longer processing times
                    
                }
                catch (Exception ex)
                {
                    chatHistory.AddAssistantMessage($"Error: {ex.Message}");
                }
                finally
                {
                    // Ensure the runtime is disposed of properly


                    // Ensure the UI is updated after the orchestration completes
                    loading = false;
                    await InvokeAsync(StateHasChanged);

                }
            });
        }

    }
}
