[< Previous Challenge](./Challenge-11.md) - [**Home**](../README.md) - [Next Challenge >](./Challenge-13.md)

# Challenge 12 - Adding Real-time Agent Response Callbacks

**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Complete Challenge 11 - Building a "Real World" Multi-Agent Solution

## Introduction

In this challenge, you will enhance your multi-agent system by implementing real-time feedback from AI agents. Currently, the entire multi-agent process runs in the background and only returns results when completely finished. This approach doesn't provide visibility into the workflow progress or enable "Human-in-the-Loop" scenarios where user approval might be needed during execution.

By implementing response callbacks, you'll create a more interactive and transparent AI system that can update the UI in real-time as agents complete their tasks.

## Description

You'll be implementing a callback mechanism for your `GroupChatOrchestrator` that allows the UI to receive and display agent responses as they occur. This enables:

- **Real-time Progress Updates**: See what each agent is doing as the workflow progresses
- **Enhanced User Experience**: Visual feedback showing which agent is currently active
- **Foundation for Human-in-the-Loop**: Prepare the system for user approval workflows
- **Better Debugging**: Monitor agent conversations and identify issues faster

The callback system will:
1. Capture each agent's response as it happens
2. Update the UI with the latest activity
3. Maintain a chat history for logging and analysis
4. Generate human-friendly summaries of agent responses

## Learning Objectives

By the end of this challenge, you will understand:
- How to implement callback patterns in multi-agent systems
- Real-time UI updates with Blazor Server
- Chat history management and processing
- Using AI to generate user-friendly summaries from technical agent responses

## Challenges

### 1. Configure Response Callbacks

Research the Semantic Kernel documentation on [Group Chat Orchestration](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/group-chat?pivots=programming-language-csharp) to understand how to implement response callbacks.

In your `GroupChatOrchestration` object configuration, add a `ResponseCallback` property that points to the `AgentResponseCallbackAsync` method that's already stubbed out for you.

### 2. Implement Real-time UI Updates

Within the `AgentResponseCallbackAsync` method, you need to:

- Update the `_currentWorkflowUpdated` field so the "Last Update" timestamp in the UI reflects current activity
- Add each response to the `_chatHistory` collection for future processing and logging
- Ensure the UI refreshes to show these updates in real-time

### 3. Generate AI-Powered Summaries

Use the `ChatCompletionService` and the existing `ExtractSummaryFromContent` helper method to:

- Create a prompt that asks the AI to generate a human-friendly summary of each agent response
- Request the response be wrapped in `<summary></summary>` tags for easy parsing
- Extract the summary content and update the `_resultSummary` field for UI display

> [!TIP]
> Look at how `ChatCompletionService` is used elsewhere in the project for guidance on proper implementation patterns.

## Success Criteria

✅ **Response Callback Configured**: The `GroupChatOrchestration` object includes the `ResponseCallback` property  
✅ **Real-time Updates Working**: The "Last Update" field in the UI updates as agents respond  
✅ **Chat History Maintained**: Agent responses are stored in the `_chatHistory` collection  
✅ **Summaries Generated**: The `_resultSummary` field displays human-friendly summaries of agent activity  
✅ **UI Updates in Real-time**: When you upload files and start the workflow, the UI shows progress updates as each agent completes its work

## Resources

- [Semantic Kernel Agent Orchestration Documentation](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/agent-orchestration/group-chat?pivots=programming-language-csharp)
- [ChatCompletionService Documentation](https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/?tabs=csharp-AzureOpenAI%2Cpython-AzureOpenAI%2Cjava-AzureOpenAI&pivots=programming-language-csharp)
- Review the existing helper methods in the `MultiAgentImport.razor.cs` file for parsing patterns

## Next Steps

In Challenge 13, you'll build an MCP (Model Context Protocol) server that provides state tracking capabilities for your multi-agent workflow, making it even more reliable and observable.

---

[< Previous Challenge](./Challenge-11.md) - [**Home**](../README.md) - [Next Challenge >](./Challenge-13.md)