# Python API Implementation (Semantic Kernel Focused)

This example demonstrates how to implement API endpoints for Chat UI using FastAPI and **Microsoft Semantic Kernel for Python**.

**Recommended Approach:** Directly return the native `semantic_kernel.contents.chat_message_content.ChatMessageContent` object (or a `List` of them) serialized as JSON. The frontend (`ApiChatService.ts`) is designed to parse this.

**Alternative (Non-SK):** If not using Semantic Kernel, see the [Minimal JSON Format definition](../response-formats.md#alternative-approach-minimal-json-format-non-semantic-kernel) and construct that structure manually (e.g., using dictionaries).

The examples below focus on the recommended Semantic Kernel approach.

## Request Format (Unchanged)

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

*   `role` (e.g., `AuthorRole.ASSISTANT`)
*   `content` (string, primary text - SK provides this as a property)
*   `name` (string, maps to `AuthorName`, required for multi-agent)
*   `items` (list, fallback for text via `TextContent`)

## Implementation Example (FastAPI with Semantic Kernel)

This example assumes you have a Semantic Kernel `Kernel` and a chat completion service (like `AzureChatCompletion` or `OpenAIChatCompletion`) configured.

### Imports

```python
import asyncio
import uuid
from typing import List, Optional

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from semantic_kernel import Kernel # Assuming Kernel is configured
from semantic_kernel.connectors.ai.chat_completion_client_base import ChatCompletionClientBase # Base type for services
from semantic_kernel.contents.chat_history import ChatHistory
from semantic_kernel.contents.chat_message_content import ChatMessageContent
from semantic_kernel.contents.text_content import TextContent
from semantic_kernel.contents.utils.author_role import AuthorRole
```

### Request Models

```python
# --- Request Models --- 

class MessageDto(BaseModel):
    role: str
    content: str

class MessageRequest(BaseModel):
    messages: List[MessageDto]
```

### App Setup and Helper Function

```python
app = FastAPI()

# --- Assume Kernel and Chat Service are configured and potentially injected --- 
# kernel = Kernel()
# kernel.add_service(...) # Add your configured AzureChatCompletion or OpenAIChatCompletion
# chat_service = kernel.get_service(ChatCompletionClientBase)

# Helper to get configured chat service (replace with your actual injection/retrieval logic)
async def get_chat_service() -> ChatCompletionClientBase:
    # This is a placeholder. In a real app, you'd likely inject the kernel or service.
    from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion # Example
    # Load config from env or other sources
    # service = AzureChatCompletion(...) 
    # return service
    raise NotImplementedError("Kernel/Chat Service not configured in this example")
```

### Standard Chat Endpoint

```python
# Standard chat endpoint (/api/chat)
@app.post("/api/chat") # Removed response_model as we return SK object directly
async def standard_chat_response(request: MessageRequest):
    chat_service = await get_chat_service() # Get the configured service
    
    chat_history = ChatHistory()
    # Populate chat_history from request.messages
    for msg in request.messages:
        role = AuthorRole(msg.role.upper())
        chat_history.add_message(ChatMessageContent(role=role, items=[TextContent(text=msg.content)]))

    # *** Semantic Kernel Integration Point ***
    # Get response from SK Chat Completion Service
    # This might involve kernel.invoke() if using plugins/planning
    # For simplicity, calling the service directly:
    results: List[ChatMessageContent] = await chat_service.get_chat_message_contents(chat_history=chat_history) # kernel=kernel if needed

    # Check if we got a result
    if not results:
        # Handle error: No response from AI
        # Using FastAPI's HTTPException is recommended here
        return {"error": "No response from AI"} # Simple error for example
        
    # *** Return the SK object directly ***
    # FastAPI handles Pydantic model serialization. Return the list (usually one item).
    # Ensure your SK ChatMessageContent can be serialized (check Pydantic v1/v2 compatibility if needed)
    return results 
```

### Multi-Agent Streaming Endpoint

```python
# Streaming endpoint for multi-agent chat (/api/multi-agent-chat/stream)
@app.post("/api/multi-agent-chat/stream")
async def stream_multi_agent_response(request: MessageRequest):
    # chat_service = await get_chat_service() # Potentially needed if streaming comes from service
    # chat_history = ChatHistory() # Populate as above

    # *** Semantic Kernel Integration Point ***
    # Simulate multiple agent responses for the example
    # In a real app, this would involve invoking multiple agents/plugins via the kernel
    # and handling their streaming results (e.g., using chat_service.complete_chat_stream_async).

    agents = ["Research", "Code", "Planning"]
    temp_conversation_id = str(uuid.uuid4()) # Example ID

    async def generate_responses():
        for agent in agents:
            # Simulate getting a ChatMessageContent result for each agent
            agent_response = ChatMessageContent(
                role=AuthorRole.ASSISTANT,
                items=[TextContent(text=f"Streamed response from the {agent} agent.")],
                name=agent, # Use 'name' for AuthorName in Python SK
                metadata={'ConversationId': temp_conversation_id} # Example metadata
            )
            
            # *** Serialize and stream the SK object directly ***
            # Use .model_dump_json for Pydantic v2, .json for v1
            try: 
              json_response = agent_response.model_dump_json(exclude_none=True)
            except AttributeError: 
              json_response = agent_response.json(exclude_none=True)
              
            yield f"data: {json_response}\n\n"
            await asyncio.sleep(1) # Simulate agent work

    return StreamingResponse(generate_responses(), media_type="text/event-stream")
```

### Multi-Agent Batch Endpoint

```python
# Batch endpoint for multi-agent chat (/api/multi-agent-chat/batch)
@app.post("/api/multi-agent-chat/batch") # Removed response_model
async def batch_multi_agent_response(request: MessageRequest):
    # chat_service = await get_chat_service() # Potentially needed
    # chat_history = ChatHistory() # Populate as above

    # *** Semantic Kernel Integration Point ***
    # Simulate getting results from multiple agents/kernel invocations
    agents = ["Research", "Code", "Planning"]
    responses: List[ChatMessageContent] = []
    temp_conversation_id = str(uuid.uuid4()) # Example ID

    for agent in agents:
         # Simulate getting a ChatMessageContent result for each agent
         agent_response = ChatMessageContent(
            role=AuthorRole.ASSISTANT,
            items=[TextContent(text=f"Batch response from the {agent} agent.")],
            name=agent, # Use 'name' for AuthorName
            metadata={'ConversationId': temp_conversation_id} # Example metadata
        )
         responses.append(agent_response)

    # *** Return the List of SK objects directly ***
    return responses
```

## Key Points

1.  **Return Native `ChatMessageContent`**: The recommended approach is to return the `semantic_kernel.contents.chat_message_content.ChatMessageContent` object (or `List`) directly. FastAPI handles Pydantic model serialization.
2.  **Simplified Backend Logic**: No need to manually create specific Pydantic models for the response if using Semantic Kernel; leverage the native SK types.
3.  **Frontend Responsibility**: The frontend (`ApiChatService.ts`) is responsible for extracting the needed fields (`role`, `name`/`AuthorName`, `content`/`items`) from the potentially richer `ChatMessageContent` structure.
4.  **`name` Property**: Use the `name` property of `ChatMessageContent` to convey the `AuthorName` for multi-agent scenarios.
5.  **Serialization**: Ensure proper JSON serialization, using `.model_dump_json(exclude_none=True)` for Pydantic v2 or `.json(exclude_none=True)` for v1, especially in streaming.
6.  **Non-SK Alternative**: If not using Semantic Kernel, implement the [minimal JSON format](../response-formats.md#alternative-approach-minimal-json-format-non-semantic-kernel) using Python dictionaries.

This Semantic Kernel-centric approach simplifies the Python backend implementation significantly. 