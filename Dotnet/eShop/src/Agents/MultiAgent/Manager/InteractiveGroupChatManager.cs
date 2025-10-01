using System.Diagnostics;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents.Orchestration.GroupChat;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;

namespace Agents.MultiAgent.Manager;

public class InteractiveGroupChatManager(string shortPrompt, 
    IChatCompletionService chatCompletion, 
    ActivitySource activitySource,
    ILogger<InteractiveGroupChatManager> logger) : GroupChatManager
{
    private const string TerminationString = "<complete>";
    
    private ChatHistory _history = [];
    
    public ChatHistory History => _history;


    public static class Prompts
    {
        public static string Termination(string shortPrompt) =>
            $"""
             You are the Orchestration agent that manages the completion of the following task:
             '{shortPrompt}'
             You need to determine if the task has been completed. If you feel like the task is
             complete, please respond with <complete>, otherwise, respond with <continue>.
             If the task is waiting on user approval, respond with a <approval_required></approval_required> 
             XML block for easy parsing, adding the request to the user in a human friendly
             HTML layout using Blazor FluentUI css classes inside the XML tag. Please only include valid HTML in the
             <approval_required></approval_required> block. DO NOT prefix or postfix the response
             with any other information, as it will be rendered directly to the user. 
             """;

        public static string Selection(string shortPrompt, GroupChatTeam participants) =>
            $"""
             You are the Orchestration agent that manages the completion of the following task:
             '{shortPrompt}'
             
             Each agent in the group has been assigned a specific task to complete. Please do not
             allow agents to complete tasks they are not specialized for. Only accept data and
             results from agents for their specific area of responsibility.
             
             You need to choose the next agent from the list of participants to assist with
             the completion of your task. Based on the state of the task, choose from the following
             agents to continue:
             {participants.FormatList()}\n
             Please respond with only the name of the participant you would like to select.
             """;

        public static string Filter(string shortPrompt) =>
            $"""
             You are the Orchestration agent that manages the completion of the following task:
             '{shortPrompt}'
             You have just completed this task. Please provide a human friendly summary of the results
             in HTML format, wrapped in a <summary></summary> XML block for easy parsing.
             Do not escape any HTML, nor wrap it in markdown. Just add the HTML directly to the
             summary tag inner content.
             """;
    }

    public override ValueTask<GroupChatManagerResult<string>> FilterResults(ChatHistory history,
        CancellationToken cancellationToken = new CancellationToken())
    {
        var filterResultsActivity = activitySource.StartActivity("FilterResults", ActivityKind.Client, null, null);
        logger.LogInformation("Results filter called. Writing out chat history first.");
        foreach (var message in history)
            logger.LogInformation("Author: {Author}, Message: {Message}", message.AuthorName, message.Content);
        var response = this.GetResponseAsync<string>(history, Prompts.Filter(shortPrompt), cancellationToken);
        filterResultsActivity.SetStatus(ActivityStatusCode.Ok);
        filterResultsActivity.Stop();
        return response;
    }

    public override async ValueTask<GroupChatManagerResult<string>> SelectNextAgent(ChatHistory history, GroupChatTeam team,
        CancellationToken cancellationToken = new CancellationToken())
    {
        var selectNextAgentActivity = activitySource.StartActivity("SelectNextAgent", ActivityKind.Client, null, null);
        var response = this.GetResponseAsync<string>(history, Prompts.Selection(shortPrompt, team), cancellationToken);
        selectNextAgentActivity.SetCustomProperty("SelectedAgent", (await response).Value);
        selectNextAgentActivity.SetStatus(ActivityStatusCode.Ok);
        selectNextAgentActivity.Stop();
        return await response;
    }

    public override ValueTask<GroupChatManagerResult<bool>> ShouldRequestUserInput(ChatHistory history, CancellationToken cancellationToken = new CancellationToken())
    {
        var shouldRequestUserInputActivity = activitySource.StartActivity("ShouldRequestUserInput", ActivityKind.Internal, null, null);
        _history = history;
        string? lastAgent = history.LastOrDefault()?.AuthorName;

        if (lastAgent is null)
        {
            shouldRequestUserInputActivity.SetStatus(ActivityStatusCode.Ok);
            shouldRequestUserInputActivity.Stop();
            return ValueTask.FromResult(new GroupChatManagerResult<bool>(false)
            { Reason = "No agents have spoken yet." });
        }

        string? lastMessage = history.LastOrDefault()?.Content;
        
        if (lastAgent == "DatabaseSpecialistAgent" && lastMessage.Contains("<approval_required>"))
        {
            shouldRequestUserInputActivity.SetStatus(ActivityStatusCode.Ok);
            shouldRequestUserInputActivity.SetCustomProperty("ApprovalRequesteedAgent", lastAgent);
            shouldRequestUserInputActivity.SetCustomProperty("RequestedApproval", true);
            shouldRequestUserInputActivity.Stop();
            return ValueTask.FromResult(new GroupChatManagerResult<bool>(true)
            { Reason = "User input is required to approve database changes." });
        }

        if (lastAgent == "MarketingAgent" && lastMessage.Contains("<approval_required>"))
        {
            shouldRequestUserInputActivity.SetStatus(ActivityStatusCode.Ok);
            shouldRequestUserInputActivity.SetCustomProperty("ApprovalRequesteedAgent", lastAgent);
            shouldRequestUserInputActivity.SetCustomProperty("RequestedApproval", true);
            shouldRequestUserInputActivity.Stop();
            return ValueTask.FromResult(new GroupChatManagerResult<bool>(true)
            {
                Reason = "User input is required to approve sending emails."
            });
        }

        if (lastMessage.Contains(("<approval_required>")))
        {
            shouldRequestUserInputActivity.SetStatus(ActivityStatusCode.Ok);
            shouldRequestUserInputActivity.SetCustomProperty("RequestedApproval", true);
            shouldRequestUserInputActivity.Stop();
            return ValueTask.FromResult(new GroupChatManagerResult<bool>(true)
            {
                Reason = "An agent has requested user approval to continue."
            });
        }
        shouldRequestUserInputActivity.SetStatus(ActivityStatusCode.Ok);
        shouldRequestUserInputActivity.Stop();
        return ValueTask.FromResult(new GroupChatManagerResult<bool>(false)
        {
            Reason = "No user input required for this task at this moment."
        });
    }

    public override ValueTask<GroupChatManagerResult<bool>> ShouldTerminate(ChatHistory history, CancellationToken cancellationToken = new CancellationToken())
    {
        var shouldTerminateActivity = activitySource.StartActivity("ShouldTerminate", ActivityKind.Client, null, null);
        var lastMessage = history.LastOrDefault()?.Content;
        if (lastMessage is null)
        {
            shouldTerminateActivity.SetStatus(ActivityStatusCode.Ok);
            shouldTerminateActivity.Stop();
            return base.ShouldTerminate(history, cancellationToken);
        }

        var lastAgent = history.LastOrDefault()?.AuthorName;
        var response = this.GetResponseAsync<bool>(history, Prompts.Termination(shortPrompt), cancellationToken);
        shouldTerminateActivity.SetStatus(ActivityStatusCode.Ok);
        shouldTerminateActivity.Stop();
        return response;
    }

    private async ValueTask<GroupChatManagerResult<TValue>> GetResponseAsync<TValue>(ChatHistory history, string prompt,
        CancellationToken cancellationToken = new CancellationToken())
    {
        var getResponseActivity = activitySource.StartActivity("GetResponse", ActivityKind.Client, null, null);
        var executionSettings = new AzureOpenAIPromptExecutionSettings()
        {
            ResponseFormat = typeof(GroupChatManagerResult<TValue>),
        };

        ChatHistory request = [.. history, new ChatMessageContent(AuthorRole.System, prompt)];
        var response = await chatCompletion.GetChatMessageContentAsync(request,
            executionSettings,
            kernel: null,
            cancellationToken);

        var responseText = response.ToString();
        getResponseActivity.SetCustomProperty("ChatResponse", responseText);
        var results = JsonSerializer.Deserialize<GroupChatManagerResult<TValue>>(responseText) ??
               throw new InvalidOperationException($"Failed to parse response: {responseText}");
        getResponseActivity.SetStatus(ActivityStatusCode.Ok);
        getResponseActivity.Stop();
        return results;
    }
}