# **Exercise 8**: Multi-Agent Systems

### Estimated Duration: 60 minutes

Now it's time to introduce Image generation to the reference application using DALL-E. DALL-E is an artificial intelligence (AI) model that generates images from textual descriptions. DALL-E can create images of objects, scenes, and even abstract concepts based on the descriptive text provided to it. This capability allows for a wide range of creative possibilities, from illustrating ideas to creating entirely new visual concepts that might not exist in the real world.

## Objectives
In this exercise, you will be performing the following tasks:

## Task 1: Create Multi-agent chat system

<details>
<summary><strong>Python</strong></summary>

1. Navigate to `Python>src` directory and open **multi_agent.py** file.
1. Remove the existing code and add the following code in the file.
    ```
    import os
    import asyncio
    import sys
    from datetime import datetime
    import logging

    from semantic_kernel.agents import AgentGroupChat, ChatCompletionAgent
    from semantic_kernel.agents.strategies.termination.termination_strategy import TerminationStrategy
    from semantic_kernel.agents.strategies.selection.kernel_function_selection_strategy import (
        KernelFunctionSelectionStrategy,
    )
    from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
    from semantic_kernel.connectors.ai.open_ai.services.azure_chat_completion import AzureChatCompletion
    from semantic_kernel.contents.chat_message_content import ChatMessageContent
    from semantic_kernel.contents.utils.author_role import AuthorRole
    from semantic_kernel.kernel import Kernel

    logger = logging.getLogger(__name__)

    class ApprovalTerminationStrategy(TerminationStrategy):
        """A strategy for determining when an agent should terminate."""
        
        async def should_agent_terminate(self, agent, history):
            """Check if the agent should terminate."""
            if not history:
                return False
            
            # Check the last message in the history
            last_message = history[-1]
            content = getattr(last_message, 'content', '')
            
            # Check for approval token in the last message content
            if '%APPR%' in content:
                return True
            
            return False

    async def run_multi_agent(input: str):
        """Implement the multi-agent system."""
        
        # Create a single instance of AzureChatCompletion service
        azure_chat_completion_service = AzureChatCompletion(
            deployment_name=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME"),
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )

        # Create Kernel instances for each agent and add the service
        kernel_business_analyst = Kernel()
        kernel_business_analyst.add_service(azure_chat_completion_service)
        
        kernel_software_engineer = Kernel()
        kernel_software_engineer.add_service(azure_chat_completion_service)
        
        kernel_product_owner = Kernel()
        kernel_product_owner.add_service(azure_chat_completion_service)

        # Define instructions for each agent
        instructions_business_analyst = """
        You are a Business Analyst which will take the requirements from the user (also known as a 'customer')
        and create a project plan for creating the requested app. The Business Analyst understands the user
        requirements and creates detailed documents with requirements and costing. The documents should be 
        usable by the SoftwareEngineer as a reference for implementing the required features, and by the 
        Product Owner for reference to determine if the application delivered by the Software Engineer meets
        all of the user's requirements.
        """
        
        instructions_software_engineer = """
        You are a Software Engineer, and your goal is create a web app using HTML and JavaScript
        by taking into consideration all the requirements given by the Business Analyst. The application should
        implement all the requested features. Deliver the code to the Product Owner for review when completed.
        You can also ask questions of the BusinessAnalyst to clarify any requirements that are unclear.
        """
        
        instructions_product_owner = """
        You are the Product Owner which will review the software engineer's code to ensure all user 
        requirements are completed. You are the guardian of quality, ensuring the final product meets
        all specifications and receives the green light for release. Once all client requirements are
        completed, you can approve the request by just responding "%APPR%". Do not ask any other agent
        or the user for approval. If there are missing features, you will need to send a request back
        to the SoftwareEngineer or BusinessAnalyst with details of the defect. To approve, respond with
        the token %APPR%.
        """

        # Create agents
        business_analyst_agent = ChatCompletionAgent(
            name="BusinessAnalyst",
            instructions=instructions_business_analyst,
            kernel=kernel_business_analyst
        )
        
        software_engineer_agent = ChatCompletionAgent(
            name="SoftwareEngineer",
            instructions=instructions_software_engineer,
            kernel=kernel_software_engineer
        )
        
        product_owner_agent = ChatCompletionAgent(
            name="ProductOwner",
            instructions=instructions_product_owner,
            kernel=kernel_product_owner
        )

        # Create an AgentGroupChat with the termination strategy
        termination_strategy = ApprovalTerminationStrategy()
        agents = [business_analyst_agent, software_engineer_agent, product_owner_agent]
        agent_group_chat = AgentGroupChat(
            agents=agents,
            termination_strategy=termination_strategy
        )

        # Add user input message to the chat
        user_input = ChatMessageContent(
            role=AuthorRole.USER,
            content=input
        )
        await agent_group_chat.add_chat_message(user_input)
        results = []

        async for message in agent_group_chat.invoke():
            # Extract agent role/name if available
            agent_role = "User"
            if hasattr(message, 'author'):
                agent_role = message.author
            elif hasattr(message, 'role') and message.role == AuthorRole.ASSISTANT:
                # Determine which agent replied based on the message content or metadata
                if hasattr(message, 'metadata') and 'agent_name' in message.metadata:
                    agent_role = message.metadata['agent_name']
                # Try to determine which agent based on metadata or other properties
                if hasattr(message, 'metadata') and 'agent_name' in message.metadata:
                    agent_role = message.metadata['agent_name']
                        
            # Defensive: ensure message is an object, not a raw string
            if hasattr(message, 'content') and hasattr(message, 'role'):
                results.append({
                    "role": message.role,
                    "agent": agent_role,
                    "content": message.content
                })
            else:
                # fallback in case it's just a string or invalid type
                results.append({
                    "role": "unknown",
                    "agent": agent_role,
                    "content": str(message)
                })
        return {
            "messages": results
        }
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
    Build a Calculator app.
    ```
</details>

<details>
<summary><strong>C Sharp(C#)</strong></summary>

1. Navigate to `Dotnet>src>BlazorAI>Components>Pages` directory and open **MultiAgent.razor.cs** file.
1. Remove the existing code and add the following code in the file.
    ```
    using Microsoft.AspNetCore.Components;
    using Microsoft.SemanticKernel;
    using Microsoft.SemanticKernel.Agents;
    using Microsoft.SemanticKernel.Agents.Chat;
    using Microsoft.SemanticKernel.ChatCompletion;
    using Microsoft.SemanticKernel.Connectors.OpenAI;
    using System.Threading;
    using Microsoft.Extensions.Logging;
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

            // Keep only one declaration of MessageInput and loading

            [Inject]
            public required IConfiguration Configuration { get; set; }
            
            [Inject]
            private ILoggerFactory LoggerFactory { get; set; } = null!;
            
            [Inject]
            private ILogger<MultiAgent> Logger { get; set; }

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
            }

            private async Task CreateAgents()
            {
                string BusinessAnalystInstructions = """
                    You are a Business Analyst which will take the requirements from the user (also known as a 'customer') and create a project plan for creating the requested app and hand it over to the software engineer to create the code on the requirement.
                    """;

                ChatCompletionAgent BusinessAnalystAgent = new()
                {
                    Instructions = BusinessAnalystInstructions,
                    Name = "BusinessAnalyst",
                    Kernel = kernel
                };
                Agents.Add(BusinessAnalystAgent);

                string SoftwareEngineerInstructions = """
                    You are a Software Engineer, and your goal is create a web app using HTML and JavaScript by taking into consideration all the requirements given by the Business Analyst. The application should implement all the requested features. Deliver the code to the Product Owner for review when completed. You can also ask questions of the BusinessAnalyst to clarify any requirements that are unclear.
                    """;

                ChatCompletionAgent SoftwareEngineerAgent = new()
                {
                    Instructions = SoftwareEngineerInstructions,
                    Name = "SoftwareEngineer",
                    Kernel = kernel
                };
                Agents.Add(SoftwareEngineerAgent);

                string ProductOwnerInstructions = """
                    You are the Product Owner which will review the software engineer's code to ensure all user requirements are completed. You are the guardian of quality, ensuring the final product meets all specifications and receives the green light for release. Once all client requirements are completed, you can approve the request by just responding "%APPR%". Do not ask any other agent or the user for approval. If there are missing features, you will need to send a request back to the SoftwareEngineer or BusinessAnalyst with details of the defect. To approve, respond with the token %APPR%.
                    """;

                ChatCompletionAgent ProductOwnerAgent = new()
                {
                    Instructions = ProductOwnerInstructions,
                    Name = "ProductOwner",
                    Kernel = kernel
                };
                Agents.Add(ProductOwnerAgent);

                // Setup the group chat with approval termination
                AgentGroupChat = new AgentGroupChat(
                    BusinessAnalystAgent, SoftwareEngineerAgent, ProductOwnerAgent)
                {
                    ExecutionSettings = new()
                    {
                        TerminationStrategy = new ApprovalTerminationStrategy()
                        {
                            Agents = [ProductOwnerAgent],
                            MaximumIterations = 25,
                        }
                    }
                };
            }

            private async Task SendMessage()
            {
                if (string.IsNullOrWhiteSpace(MessageInput) || chatHistory == null || kernel == null || AgentGroupChat == null)
                    return;

                var userMessage = MessageInput;
                MessageInput = string.Empty;
                loading = true;
                chatHistory.AddUserMessage(userMessage);
                StateHasChanged();

                try
                {
                    var chatMessageContent = new ChatMessageContent(
                        AuthorRole.User,
                        userMessage
                    );

                    AgentGroupChat.AddChatMessage(chatMessageContent);

                    await foreach (var message in AgentGroupChat.InvokeAsync(CancellationToken.None))
                    {
                        if (message.Role == AuthorRole.Assistant)
                        {
                            string formattedMessage = $"{message.AuthorName}: {message.Content}";
                            chatHistory.AddAssistantMessage(formattedMessage);
                        }
                        else if (message.Role == AuthorRole.User)
                        {
                            chatHistory.AddUserMessage(message.Content);
                        }
                        else if (message.Role == AuthorRole.System)
                        {
                            // Handle system messages if needed
                        }
                        
                        StateHasChanged();
                    }
                }
                catch (Exception ex)
                {
                    chatHistory.AddAssistantMessage($"Error: {ex.Message}");
                    Logger.LogError(ex, "Error while trying to send message to agents.");
                }
                finally
                {
                    loading = false;
                    StateHasChanged();
                }
            }
        }

        sealed class ApprovalTerminationStrategy : TerminationStrategy
        {
            public IReadOnlyList<Agent> Agents { get; set; } = Array.Empty<Agent>();
            public int MaximumIterations { get; set; } = 25;
            private int _currentIteration = 0;
            
            protected override Task<bool> ShouldAgentTerminateAsync(Agent agent, IReadOnlyList<ChatMessageContent> history, CancellationToken cancellationToken = default)
            {
                if (++_currentIteration > MaximumIterations)
                {
                    return Task.FromResult(true);
                }

                if (history.Count == 0)
                {
                    return Task.FromResult(false);
                }

                var lastMessage = history[^1];

                bool containsApprovalToken = lastMessage.Content?.Contains("%APPR%", StringComparison.OrdinalIgnoreCase) ?? false;

                if (containsApprovalToken && Agents.Count > 0)
                {
                    return Task.FromResult(containsApprovalToken && Agents.Any(a => a.Name == lastMessage.AuthorName));
                }

                return Task.FromResult(containsApprovalToken);
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
    Build a Calculator app.
    ```
</details>