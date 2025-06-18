# C# API Implementation (Semantic Kernel Focused)

This example shows how to implement API endpoints for Chat UI using ASP.NET Core and **Microsoft Semantic Kernel**.

**Recommended Approach:** Directly return the native `Microsoft.SemanticKernel.ChatMessageContent` object (or a `List` of them) serialized as JSON. The frontend (`ApiChatService.ts`) is designed to parse this.

**Alternative (Non-SK):** If not using Semantic Kernel, see the [Minimal JSON Format definition](../response-formats.md#alternative-approach-minimal-json-format-non-semantic-kernel) and construct that structure manually.

The examples below focus on the recommended Semantic Kernel approach.

## Request Format

All chat endpoints expect the following JSON request body:

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "latest message..." }
  ]
}
```

## Semantic Kernel `ChatMessageContent` Structure (Conceptual)

The API response should be the JSON serialization of one or more `ChatMessageContent` objects. Key fields the frontend expects:

*   `Role` (e.g., `AuthorRole.Assistant`)
*   `Content` (string, primary text)
*   `Items` (collection, fallback for text via `TextContent`)
*   `AuthorName` (string, required for multi-agent)

## Implementation Example (ASP.NET Core with Semantic Kernel)

This example assumes you have a Semantic Kernel `Kernel` and a `IChatCompletionService` configured.

### Imports and Namespaces

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
```

### Request DTOs

```csharp
// --- Request DTOs (Minimal) ---

public class MessageRequest
{
    public List<MessageDto>? Messages { get; set; }
}

// Renamed to avoid conflict with SK's internal Message class if used directly
public class MessageDto 
{
    public string? Role { get; set; }
    public string? Content { get; set; }
}
```

### Controller Setup

```csharp
[ApiController]
[Route("api")]
public class ChatController : ControllerBase
{
    private readonly IChatCompletionService _chatCompletionService;
    private readonly Kernel _kernel; // Assuming Kernel is injected or available

    public ChatController(IChatCompletionService chatCompletionService, Kernel kernel)
    {
        _chatCompletionService = chatCompletionService;
        _kernel = kernel; // Required if using plugins/function calling
    }
```

### Standard Chat Endpoint

```csharp
    // Standard chat endpoint (/api/chat)
    [HttpPost("chat")]
    public async Task<ActionResult<List<ChatMessageContent>>> StandardChatResponse([FromBody] MessageRequest request)
    {
        var chatHistory = new ChatHistory();
        request.Messages?.ForEach(m => 
        {
            var role = m.Role?.ToLowerInvariant() switch {
                "user" => AuthorRole.User,
                "assistant" => AuthorRole.Assistant,
                "system" => AuthorRole.System,
                _ => AuthorRole.User // Default or handle error
            };
            chatHistory.AddMessage(new ChatMessageContent(role, m.Content));
        });

        // *** Semantic Kernel Integration Point ***
        // Get response from SK Chat Completion Service
        // This might involve kernel.InvokePromptAsync or directly using _chatCompletionService
        // For simplicity, let's assume _chatCompletionService returns a ChatMessageContent
        
        // Example: Directly using the service (without plugins/planning for simplicity)
        var result = await _chatCompletionService.GetChatMessageContentAsync(chatHistory);

        // *** Return the SK object directly ***
        // The result is already ChatMessageContent, wrap in List for consistency
        return Ok(new List<ChatMessageContent> { result });
    }
```

### Multi-Agent Streaming Endpoint

```csharp
    // Streaming endpoint for multi-agent chat (/api/multi-agent-chat/stream)
    [HttpPost("multi-agent-chat/stream")]
    public async Task StreamMultiAgentResponse([FromBody] MessageRequest request)
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");

        var chatHistory = new ChatHistory(); // Populate as in standard chat
         request.Messages?.ForEach(m => 
        {
            var role = m.Role?.ToLowerInvariant() switch {
                "user" => AuthorRole.User,
                "assistant" => AuthorRole.Assistant,
                "system" => AuthorRole.System,
                _ => AuthorRole.User // Default or handle error
            };
            chatHistory.AddMessage(new ChatMessageContent(role, m.Content));
        });

        // *** Semantic Kernel Integration Point ***
        // Use streaming completion. This might involve multiple agents/plugins.
        // We need to simulate multiple responses for the example.
        // In a real scenario, this might loop through agent results or process SK streaming chunks.

        var agents = new List<string> { "Research", "Code", "Planning" };
        var tempConversationId = Guid.NewGuid().ToString(); // Example ID

        foreach (var agent in agents)
        {
             // Simulate getting a ChatMessageContent result for each agent
             // In a real app, this would come from invoking the agent/kernel
            var agentResponse = new ChatMessageContent(
                AuthorRole.Assistant, 
                content: $"Streamed response from the {agent} agent.",
                authorName: agent // Set AuthorName for multi-agent
                // metadata can be added if needed
            );
            agentResponse.Metadata ??= new Dictionary<string, object?>();
            agentResponse.Metadata["ConversationId"] = tempConversationId; // Example metadata

            // *** Serialize and stream the SK object directly ***
            string jsonResponse = JsonSerializer.Serialize(agentResponse, new JsonSerializerOptions 
            { 
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull 
                // Add converters if needed for complex SK types not handled by default
            });

            await Response.WriteAsync($"data: {jsonResponse}\n\n");
            await Response.Body.FlushAsync();
            await Task.Delay(1000, HttpContext.RequestAborted); // Simulate work
        }
    }
```

### Multi-Agent Batch Endpoint

```csharp
    // Batch endpoint for multi-agent chat (/api/multi-agent-chat/batch)
    [HttpPost("multi-agent-chat/batch")]
    public async Task<ActionResult<List<ChatMessageContent>>> BatchMultiAgentResponse([FromBody] MessageRequest request)
    {
        var chatHistory = new ChatHistory(); // Populate as in standard chat
         request.Messages?.ForEach(m => 
        {
            var role = m.Role?.ToLowerInvariant() switch {
                "user" => AuthorRole.User,
                "assistant" => AuthorRole.Assistant,
                "system" => AuthorRole.System,
                _ => AuthorRole.User // Default or handle error
            };
            chatHistory.AddMessage(new ChatMessageContent(role, m.Content));
        });

        // *** Semantic Kernel Integration Point ***
        // Simulate getting results from multiple agents/kernel invocations
        var agents = new List<string> { "Research", "Code", "Planning" };
        var responses = new List<ChatMessageContent>();
        var tempConversationId = Guid.NewGuid().ToString(); // Example ID

        foreach (var agent in agents)
        {
            // Simulate getting a ChatMessageContent result for each agent
            var agentResponse = new ChatMessageContent(
                AuthorRole.Assistant,
                content: $"Batch response from the {agent} agent.",
                authorName: agent // Set AuthorName for multi-agent
            );
            agentResponse.Metadata ??= new Dictionary<string, object?>();
            agentResponse.Metadata["ConversationId"] = tempConversationId; // Example metadata
            responses.Add(agentResponse);
        }

        // *** Return the List of SK objects directly ***
        return Ok(responses);
    }
}
```

## Key Points

1.  **Return Native `ChatMessageContent`**: The recommended approach is to return the `Microsoft.SemanticKernel.ChatMessageContent` object (or `List<ChatMessageContent>`) directly serialized as JSON. The frontend handles parsing.
2.  **Simplified Backend Logic**: No need to manually create specific DTOs like `MinimalResponse` if using Semantic Kernel; leverage the native SK types.
3.  **Frontend Responsibility**: The frontend (`ApiChatService.ts`) is responsible for extracting the needed fields (`Role`, `AuthorName`, `Content`/`Items`) from the potentially richer `ChatMessageContent` structure.
4.  **`AuthorName`**: Ensure `AuthorName` is populated in `ChatMessageContent` for multi-agent scenarios.
5.  **Streaming**: For streaming, serialize and send each `ChatMessageContent` object as an individual SSE `data:` event.
6.  **Non-SK Alternative**: If not using Semantic Kernel, implement the [minimal JSON format](../response-formats.md#alternative-approach-minimal-json-format-non-semantic-kernel).

This Semantic Kernel-centric approach simplifies the C# backend implementation significantly. 