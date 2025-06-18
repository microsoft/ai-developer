# Message Processing Flow

This sequence diagram outlines the flow of events when a user sends a message, including API interaction, state updates, and conditional display logic.

```mermaid
%%{init: {'theme':'dark'}}%%
sequenceDiagram
    participant User
    participant UI as UI Components (MessageBubble)
    participant ChatCtx as ChatContext
    participant ChatSvc as ChatService
    participant HistorySvc as HistoryService
    participant API as External API
    participant Storage as Local Storage
    
    User->>UI: Submit message
    UI->>ChatCtx: sendMessage(content)
    
    ChatCtx->>ChatCtx: Add user message to state
    ChatCtx->>UI: Update with user message
    
    ChatCtx->>ChatCtx: Set loading state
    ChatCtx->>UI: Update loading indicators
    
    alt Standard Mode
        ChatCtx->>ChatSvc: sendMessage(userMessage)
        ChatSvc->>API: POST /chat with message
        API-->>ChatSvc: Response (incl. ASSISTANT & TOOL roles, toolCall)
        ChatSvc-->>ChatCtx: Return constructed Message object(s)
    else Multi-Agent Mode
        ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
        alt Streaming
            ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
            ChatSvc->>API: POST /multi-agent-chat/stream with message
            API-->>ChatSvc: Stream of SSE events (each with Message Content)
            ChatSvc-->>ChatCtx: Stream constructed Message objects
        else Batch
            ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
            ChatSvc->>API: POST /multi-agent-chat/batch with message
            API-->>ChatSvc: Array of Message Contents
            ChatSvc-->>ChatCtx: Return array of constructed Message objects
        end
    end
    
    ChatCtx->>ChatCtx: Add constructed Message(s) to state
    ChatCtx->>ChatCtx: Read showToolMessages state
    ChatCtx->>UI: Update with response (conditionally show TOOL msgs/indicators)
    
    ChatCtx->>HistorySvc: saveMessages(chatId, messages)
    
    alt Local History Mode
        HistorySvc->>Storage: Save to localStorage
    else API History Mode
        HistorySvc->>API: POST /history/save with messages
    end
    
    ChatCtx->>ChatCtx: Clear loading state
    ChatCtx->>UI: Update UI (hide loading indicators)
    
    UI->>User: Display complete conversation
``` 