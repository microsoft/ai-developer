# Java API Implementation for ChatUI

This example demonstrates how to implement API endpoints for Chat UI using Spring Boot. It shows how to produce the JSON structure expected by the frontend's `ApiChatService.ts`.

**Key Frontend Expectation:** The frontend service (`ApiChatService.ts`) parses specific fields from the JSON response array. Ensure your API provides these fields correctly.

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

## Response Format Expected by Frontend

The API should return a JSON array where each object represents a message. Key fields the frontend (`ApiChatService.ts`) looks for:

*   `content`: (String) **Required.** The main text content of the message.
*   `authorRole`: (String) **Required.** The role of the message author (e.g., "ASSISTANT").
*   `authorName`: (String) **Required for Multi-Agent.** The name of the specific agent. This field is *crucial* for differentiating messages in multi-agent mode. It can be at the root level of the message object or nested within `metadata`.
*   `metadata`: (Object) Optional. Can contain any additional information (e.g., usage, IDs, timestamps). If `authorName` is nested here, the frontend will attempt to find it.

**Example Response Object:**

```json
  {
    "innerContent": null, // Not used by frontend
    "metadata": { 
      // Can contain arbitrary data
      "id": "chatcmpl-unique-id",
      "usage": { /* ... */ },
      "authorName": "ResearchAgent" // Possible location for agent name
    },
    "authorRole": "ASSISTANT", // Frontend uses this
    "content": "Here is the information you requested.", // Frontend uses this
    "authorName": "ResearchAgent", // Alternative location for agent name
    "items": null, // Not used by frontend
    "encoding": "UTF-8", // Not used by frontend
    "contentType": "TEXT" // Not used by frontend
  }
```

## Implementation Example (Spring Boot)

This example uses simple Maps to construct the required JSON structure. You can adapt this using DTOs or your preferred serialization method.

### Imports

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
// --- Remove Semantic Kernel specific imports if not used ---
// import com.microsoft.semantickernel.Kernel;
// import com.microsoft.semantickernel.services.chatcompletion.*; 
// import com.microsoft.semantickernel.services.chatcompletion.message.*;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
```

### Request and Message Classes (Input DTOs)

```java
// --- Request Body Classes (Minimal) ---

class MessageRequest {
    private List<MessageDto> messages;

    // Getters and setters
    public List<MessageDto> getMessages() { return messages; }
    public void setMessages(List<MessageDto> messages) { this.messages = messages; }
}

// Renamed to avoid conflict with internal/library Message classes
class MessageDto {
    private String role;
    private String content;

    // Getters and setters
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
```

### Controller Setup

```java
@RestController
@RequestMapping("/api")
public class ChatController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    // --- Remove SK services if not used ---
    // private final ChatCompletionService chatCompletionService; 
    // private final Kernel kernel;

    // public ChatController(ChatCompletionService chatCompletionService, Kernel kernel) {
    //     this.chatCompletionService = chatCompletionService;
    //     this.kernel = kernel;
    // }
    // Basic constructor if not using SK
     public ChatController() {}
```

### Standard Chat Endpoint

```java
    // Standard chat endpoint (/api/chat)
    @PostMapping(path = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Map<String, Object>>> standardChatResponse(@RequestBody MessageRequest request) {
        // 1. Process the incoming messages (e.g., call your LLM/logic)
        // String userQuery = getLastUserMessage(request);
        String assistantResponseContent = "Hello! This is a standard response."; // Replace with actual AI response

        // 2. Construct the response object matching the frontend expectation
        Map<String, Object> responseMessage = new HashMap<>();
        responseMessage.put("authorRole", "ASSISTANT"); // Required by frontend
        responseMessage.put("content", assistantResponseContent); // Required by frontend
        
        // Add optional metadata if needed
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("id", "some-unique-id-" + UUID.randomUUID());
        metadata.put("timestamp", java.time.Instant.now().toString());
        responseMessage.put("metadata", metadata);
        
        // Standard chat expects a list with a single message
        List<Map<String, Object>> responseList = List.of(responseMessage);
        
        return ResponseEntity.ok(responseList);
    }
```

### Multi-Agent Streaming Endpoint

```java
    // Streaming endpoint for multi-agent chat (/api/multi-agent-chat/stream)
    @PostMapping(path = "/multi-agent-chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamMultiAgentResponse(@RequestBody MessageRequest request) {
        // 1. Process request, potentially involving multiple agents/steps
        List<String> agents = List.of("Research", "Code", "Review");
        String tempConversationId = UUID.randomUUID().toString();

        return Flux.fromIterable(agents)
            .delayElements(Duration.ofSeconds(1)) // Simulate work
            .map(agentName -> {
                // 2. For each agent response, construct the message object
                String agentContent = "Streamed response from the " + agentName + " agent.";
                
                Map<String, Object> responseMessage = new HashMap<>();
                responseMessage.put("authorRole", "ASSISTANT"); // Required
                responseMessage.put("content", agentContent); // Required
                responseMessage.put("authorName", agentName); // Required for multi-agent

                // Optional: Add metadata
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("conversationId", tempConversationId);
                // You could also place authorName inside metadata if preferred:
                // metadata.put("authorName", agentName);
                responseMessage.put("metadata", metadata);

                try {
                    // 3. Serialize and format as Server-Sent Event (SSE)
                    String jsonResponse = objectMapper.writeValueAsString(responseMessage);
                    return "data: " + jsonResponse + "\n\n";
                } catch (JsonProcessingException e) {
                    System.err.println("Error serializing response for agent " + agentName + ": " + e.getMessage());
                    return ""; // Skip event on error
                }
            })
            .filter(sseEvent -> !sseEvent.isEmpty());
    }
```

### Multi-Agent Batch Endpoint

```java
    // Batch endpoint for multi-agent chat (/api/multi-agent-chat/batch)
    @PostMapping(path = "/multi-agent-chat/batch", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Map<String, Object>>> batchMultiAgentResponse(@RequestBody MessageRequest request) {
        // 1. Process request, get responses from all agents
        List<String> agents = List.of("Research", "Code", "Review");
        List<Map<String, Object>> responseList = new ArrayList<>();
        String tempConversationId = UUID.randomUUID().toString();

        for (String agentName : agents) {
            // 2. Construct message object for each agent response
            String agentContent = "Batch response from the " + agentName + " agent.";
            
            Map<String, Object> responseMessage = new HashMap<>();
            responseMessage.put("authorRole", "ASSISTANT"); // Required
            responseMessage.put("content", agentContent); // Required
            responseMessage.put("authorName", agentName); // Required for multi-agent

            // Optional: Add metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("conversationId", tempConversationId);
            responseMessage.put("metadata", metadata);

            responseList.add(responseMessage);
        }
        
        // 3. Return the list of messages
        return ResponseEntity.ok(responseList);
    }
```

### Helper Methods (Example)

```java
    // --- Helper Methods (Example) ---
    private String getLastUserMessage(MessageRequest request) {
        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            // Find the last message with role 'user'
             return request.getMessages().stream()
                .filter(m -> "user".equalsIgnoreCase(m.getRole()))
                .map(MessageDto::getContent)
                .reduce((first, second) -> second) // Get the last one
                .orElse(""); // Or return empty if no user message found
        }
        return "";
    }
}
```

## Key Points

1.  **Match Frontend Needs**: Focus on providing `content`, `authorRole`, and `authorName` (for multi-agent) in the JSON response objects.
2.  **`authorName` Location**: Decide whether `authorName` will be at the root of the message object or nested within `metadata`. Ensure consistency.
3.  **Flexibility**: The frontend doesn't strictly require the exact schema shown in the example, only the key fields mentioned above. Other fields (`innerContent`, `items`, `encoding`, etc.) are ignored by the current `ApiChatService`.
4.  **Serialization**: Use standard Java JSON libraries (like Jackson, shown here with `ObjectMapper` and `Map`) or define specific DTO classes for your responses.
5.  **Streaming**: For the `/stream` endpoint, ensure each message object is correctly serialized to JSON and sent as an SSE `data:` event, followed by `\n\n`.

This approach ensures compatibility with the Chat UI frontend while giving you flexibility in your Java backend implementation.