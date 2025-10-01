using System.Diagnostics;
using System.Text;
using Agents.MultiAgent;
using Agents.MultiAgent.Manager;
using Microsoft.AspNetCore.Components;
using Microsoft.FluentUI.AspNetCore.Components;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.Agents.Runtime.InProcess;
using Microsoft.SemanticKernel.ChatCompletion;
using OpenTelemetry;
using Store.Components.Dialogs;
using Store.Context;

namespace Store.Components.Pages;

public partial class MultiAgentImport : ComponentBase, IAsyncDisposable
{
    [Inject]
    private Kernel Kernel { get; set; } = null!;

    [Inject]
    private IServiceProvider ServiceProvider { get; set; } = null!;

    [Inject]
    private IServiceScopeFactory ServiceScopeFactory { get; set; } = null!;

    // Workflow UI fields
    private string _workflowResults = string.Empty;
    private string _currentWorkflowErrorMessage = string.Empty;
    private DateTime? _currentWorkflowStarted;
    private DateTime? _currentWorkflowUpdated;
    private bool _userApprovedWorkflow = false;
    private Guid _workflowId = Guid.Empty;

    private readonly ChatHistory _chatHistory = [];

    private Timer? _statusRefreshTimer = null;

    private string _resultSummary = string.Empty;

    private bool ShouldBlockWorkflowStart => _emailFile == null || _spreadsheetFile == null || _isProcessing;

    protected override async Task OnInitializedAsync()
    {
        Logger.LogInformation("Setting up Agents");
        await AgentRegistry.SetupAgentsAsync(Kernel, ServiceProvider, Configuration, Logger);

        await base.OnInitializedAsync();
    }

    public async ValueTask<ChatMessageContent> InteractiveAgentResponseCallbackAsync(WorkflowCallbackContext context)
    {
        using var logScope = context.Logger.BeginScope(_workflowId.ToString("N"));
        await context.InvokeStateHasChanged();

        var dialogParameters = new DialogParameters()
        {
            Title = "Approve Request from LLM?",
            PrimaryAction = "Yes",
            PrimaryActionEnabled = true,
            SecondaryAction = "No",
            SecondaryActionEnabled = true,
            TrapFocus = true,
            Modal = true,
            PreventDismissOnOverlayClick = true,
            PreventScroll = true
        };

        context.Logger.LogInformation("Interactive Prompt Request for Approval called.");

        var approvalPromptActivity = context.ActivitySource.StartActivity("InteractivePromptRequest", ActivityKind.Client, null, null);
        var convertToApprovalRequest = new ChatHistory();
        // CHALLENGE 16: Implement a Human-in-the-Loop Approval Process

        // Add system prompt to set context for approval

        // Add a user message prompt to convert the last agent response to an approval request

        // Get the chat completion service from the scoped kernel

        // Call the chat completion service to convert the last agent response to an approval request

        // Log the converted approval request
        approvalPromptActivity.SetStatus(ActivityStatusCode.Ok);
        approvalPromptActivity.Stop();

        var approvalParsingActivity = context.ActivitySource.StartActivity("InteractivePromptParsing", ActivityKind.Internal, null, null);

        // Parse the response to extract the approval request
        //foreach (var approvalResult in approvalResults)
        //{
            // Look for your approval token in the response

            // Parse out the content from the results

            // Show the approval dialog to the user and wait for their response


            // Set the user approval status in the context
            //context.SetUserApprovalStatus(!result.Result.IsCanceled);
        //}
        approvalParsingActivity.SetStatus(ActivityStatusCode.Ok);
        approvalParsingActivity.Stop();

        // Set the response based on user approval, then return the chat message to the Orchestrator
        var userResponse = _userApprovedWorkflow ? "APPROVED" : "NOT APPROVED";
        return new ChatMessageContent(AuthorRole.User, $"User response: {userResponse}");
    }

    public async ValueTask AgentResponseCallbackAsync(WorkflowCallbackContext context, ChatMessageContent response, CancellationToken token)
    {
        using var logScope = context.Logger.BeginScope(_workflowId.ToString("N"));
        _currentWorkflowUpdated = DateTime.Now;

        // CHALLENGE 12: Adding Real-time Agent Response Callbacks

        // add the response to the chat history
        _chatHistory.Add(response);

        // Only generate summary if the response doesn't contain tool calls
        // to avoid OpenAI API errors about missing tool responses
        if (response.Items.All(item => item is not FunctionCallContent))
        {
            var summaryActivity = context.ActivitySource.StartActivity("GenerateSummary", ActivityKind.Client, null, null);

            try
            {
                // CHALLENGE 12 - 3: Generating Human-Friendly Summaries of Agent Responses

                summaryActivity.SetStatus(ActivityStatusCode.Ok);
                summaryActivity.Stop();
            }
            catch (Exception ex)
            {
                summaryActivity.SetStatus(ActivityStatusCode.Error);
                context.Logger.LogWarning(ex, "Failed to generate summary for agent response");
                // Fallback to raw content if summary generation fails
                _resultSummary = $"<div class=\"fluent-summary\">{response.Content}</div>";
                summaryActivity.Stop();
            }
        }
        else
        {
            // For responses with tool calls, use a simple fallback
            _resultSummary = $"<div class=\"fluent-summary\">Agent {response.AuthorName} is executing tools...</div>";
        }

        await InvokeAsync(StateHasChanged);
        context.Logger.LogInformation("Agent: {ResponseAuthorName}\r\nResponse: {ResponseContent}", response.AuthorName, response.Content);
    }


    private async Task ExecuteMultiAgentWorkflowAsync(CancellationToken token, string emailPath, string spreadsheetPath)
    {
        using var activity = new ActivitySource("MultiAgentImport");
        var multiAgentWorkflowActivity = activity.StartActivity("ExecuteMultiAgentWorkflow", ActivityKind.Internal, null, null);

        // CHALLENGE 11: Implementing a Multi-Agent Workflow with Semantic Kernel

        // Create a new service scope for the background task to avoid disposed IServiceProvider
        using var scope = ServiceScopeFactory.CreateScope();

        // Get a scoped kernel and other services from the new scope
        var scopedKernel = scope.ServiceProvider.GetRequiredService<Kernel>();
        var scopedLogger = scope.ServiceProvider.GetRequiredService<ILogger<MultiAgentImport>>();
        var scopedConfiguration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        using var logScope = scopedLogger.BeginScope(_workflowId.ToString("N"));

        // Create the callback context with scoped services and state
        var callbackContext = new WorkflowCallbackContext
        {
            ScopedKernel = scopedKernel,
            Logger = scopedLogger,
            DialogService = DialogService,
            ChatHistory = _chatHistory,
            ActivitySource = activity,
            InvokeStateHasChanged = () => InvokeAsync(StateHasChanged),
            GetUserApprovalStatus = () => _userApprovedWorkflow,
            SetUserApprovalStatus = value => _userApprovedWorkflow = value,
            SetWorkflowUpdated = value => _currentWorkflowUpdated = value,
            SetResultSummary = value => _resultSummary = value
        };

        try
        {
            scopedLogger.LogInformation("Starting multi-agent workflow");

            // Clear the agent registry to ensure clean slate
            var clearAgents = activity.StartActivity("ClearAgents", ActivityKind.Internal, multiAgentWorkflowActivity.Id, null);
            AgentRegistry.ClearAgents();
            clearAgents.SetStatus(ActivityStatusCode.Ok);
            clearAgents.Stop();

            // Setup agents with the scoped services to avoid disposed IServiceProvider
            var setupAgents = activity.StartActivity("SetupAgents", ActivityKind.Internal, multiAgentWorkflowActivity.Id, null);
            await AgentRegistry.SetupAgentsAsync(scopedKernel, scope.ServiceProvider, scopedConfiguration, scopedLogger);
            setupAgents.SetStatus(ActivityStatusCode.Ok);
            setupAgents.Stop();

            // CHALLENGE 11 - 2: Calling the Multi-Agent Orchestrator with Scoped Services
            // setup your GroupChatOrchestration with the agents from the AgentRegistry using the RoundRobinGroupChatManager

            
            var runGroupChat = activity.StartActivity("RunGroupChat", ActivityKind.Internal, multiAgentWorkflowActivity.Id, null);
            // CHALLENGE 11 - 2: Calling the Multi-Agent Orchestrator with Scoped Services
            // Run the group chat workflow with scoped services
            // Call the RunGroupChatAsync method to execute the workflow
            runGroupChat.SetStatus(ActivityStatusCode.Ok);
            runGroupChat.Stop();

            scopedLogger.LogInformation("Multi-agent workflow completed successfully");
            _isProcessing = false;
            multiAgentWorkflowActivity.SetStatus(ActivityStatusCode.Ok);
            multiAgentWorkflowActivity.Stop();
        }
        catch (Exception ex)
        {
            multiAgentWorkflowActivity.SetStatus(ActivityStatusCode.Error);
            multiAgentWorkflowActivity.SetCustomProperty("Error", ex.Message);
            multiAgentWorkflowActivity.Stop();
            scopedLogger.LogError(ex, "An error occurred during the multi-agent workflow execution.");
            _isProcessing = false;
        }
    }


    public async Task RunGroupChatAsync(
        string emailPath,
        string spreadsheetPath,
        GroupChatOrchestration orchestrator,
        WorkflowCallbackContext context)
    {
        var runGroupChatActivity = context.ActivitySource.StartActivity("RunGroupChat", ActivityKind.Internal, null, null);
        

        try
        {
            var runtime = new InProcessRuntime();
            await runtime.StartAsync(CancellationToken.None);

            var orchestratorInvokeActivity = context.ActivitySource.StartActivity("OrchestratorInvoke", ActivityKind.Client, runGroupChatActivity.Id, null);
            // CHALLENGE 11 - 3: Handling Orchestrator Responses and Extracting Results

            orchestratorInvokeActivity.SetStatus(ActivityStatusCode.Ok);
            orchestratorInvokeActivity.Stop();

            var parseResultActivity = context.ActivitySource.StartActivity("ParseResult", ActivityKind.Internal, runGroupChatActivity.Id, null);

            // Parse the response to extract the summary

            parseResultActivity.SetStatus(ActivityStatusCode.Ok);
            // add the full output to the activity for diagnostics
            //parseResultActivity.SetCustomProperty("GroupChatResponse", output);
            parseResultActivity.Stop();

            // Extract the summary from the LLM output
            //_workflowResults = ExtractSummaryFromContent(output);

            await runtime.RunUntilIdleAsync();
            await runtime.DisposeAsync();
            runGroupChatActivity.SetStatus(ActivityStatusCode.Ok);
            runGroupChatActivity.Stop();
        }
        catch (Exception e)
        {
            runGroupChatActivity.SetStatus(ActivityStatusCode.Error);
            runGroupChatActivity.SetCustomProperty("Error", e.Message);
            runGroupChatActivity.Stop();
            context.Logger.LogError(e, "Error running group chat");
            throw;
        }
    }

    private static string ExtractApprovalRequestFromContent(string content)
    {
        var match = System.Text.RegularExpressions.Regex.Match(
            content,
            @"<approval_required>\s*(.*?)\s*</approval_required>",
            System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase);

        return match.Success ? match.Groups[1].Value.Trim() : string.Empty;
    }

    private static string ExtractSummaryFromContent(string content)
    {
        // Using regex for more robust XML-like tag parsing
        var match = System.Text.RegularExpressions.Regex.Match(
            content,
            @"<summary>\s*(.*?)\s*</summary>",
            System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase);

        return match.Success ? match.Groups[1].Value.Trim() : string.Empty;
    }

    public async ValueTask DisposeAsync()
    {
        if (_statusRefreshTimer != null)
            await _statusRefreshTimer.DisposeAsync();
    }
}