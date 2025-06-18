# API Response Formats: ChatUI (Semantic Kernel Focused) ✨

This document defines the expected API response formats for the Chat UI API endpoints (`/chat`, `/multi-agent-chat/batch`, `/multi-agent-chat/stream`). The primary recommended approach utilizes Semantic Kernel.

## Recommended Approach: Return Semantic Kernel `ChatMessageContent`

If your backend implementation uses **Microsoft Semantic Kernel** (C#, Python, or Java), the simplest and recommended approach is to directly **serialize and return the native `ChatMessageContent` object** (or a list of them for batch multi-agent) as the JSON response.

The frontend service (`ApiChatService.ts`) is designed to parse the key fields from a serialized `ChatMessageContent` object, including:

*   `Role` (expected to be `Assistant`)
*   `Content` (primary text content)
*   `Items` (as a fallback for text content, specifically looking for `TextContent`)
*   `AuthorName` (C#) or `name` (Python) for multi-agent identification.

**Example (Conceptual C# `ChatMessageContent` JSON):**

```json
// Standard Chat (/chat) - Array with ONE object
[
  {
    "Role": { "Label": "Assistant" }, // Or potentially just "Assistant"
    "Content": "This is the main response text.",
    "Items": [
      { "$type": "TextContent", "Text": "This is the main response text." } 
    ],
    "Metadata": { /* ... */ }
    // ... other ChatMessageContent fields
  }
]

// Multi-Agent Batch (/multi-agent-chat/batch) - Array with MULTIPLE objects
[
  {
    "Role": { "Label": "Assistant" },
    "AuthorName": "Agent1",
    "Content": "Agent 1 response.",
    "Items": [{ "$type": "TextContent", "Text": "Agent 1 response." }]
  },
  {
    "Role": { "Label": "Assistant" },
    "AuthorName": "Agent2",
    "Content": "Agent 2 response.",
    "Items": [{ "$type": "TextContent", "Text": "Agent 2 response." }]
  }
]
```

**Note:** While the frontend primarily looks for the fields mentioned above, returning the full `ChatMessageContent` object ensures compatibility and leverages the standard SK types.

## Alternative Approach: Minimal JSON Format (Non-Semantic Kernel)

If your backend does **not** use Semantic Kernel, you must return a JSON response conforming to the following minimal structure. This structure represents the absolute minimum fields required by the Chat UI frontend.

**Core Structure:** An array `[]` containing one or more response objects `{}`.

```json
// Example: Can be one object (standard) or multiple (multi-agent batch)
[
  {
    "Role": { "Label": "Assistant" }, // Required
    "AuthorName": "Agent Name",       // Required for Multi-Agent responses ONLY
    "ConversationId": "Optional-ID", // Optional: API can provide for context
    "Items": [                       // Required, must contain at least one item with "Text"
      {
        // "$type": "TextContent",   // Optional $type
        "Text": "Response content..." // Required
      }
      // ... potentially other items, but only Text is currently processed
    ]
    // "Content": "Response content..." // Alternatively, can provide Content directly
  }
  // ... more objects for multi-agent batch
]
```

### Minimal Field Descriptions

| Field            | Parent | Type             | Required?                | Description                                                                 |
| :--------------- | :----- | :--------------- | :----------------------- | :-------------------------------------------------------------------------- |
| `Role`           | Object | Object           | **Yes**                  | Contains the role. MUST contain `"Label": "Assistant"`.                  |
| `Label`          | `Role` | String           | **Yes**                  | The label for the role. MUST be `"Assistant"`.                            |
| `AuthorName`     | Object | String           | **Multi-Agent Only**     | The name/identifier of the agent. MUST be present for multi-agent responses. MUST NOT be present for standard chat responses. |
| `Items`          | Object | Array            | **Yes**                  | An array containing content items. MUST contain at least one item with a `Text` property. | 
| `Text`           | `Items` > Object | String | **Yes (within Items)**   | The actual textual content of the message.                                  |
| `ConversationId` | Object | String           | No                       | An optional identifier for the conversation thread provided by the API.     |
| `Content`        | Object | String           | No (Alternative to Items) | The textual content can be provided directly here instead of within `Items`.|


### Endpoint-Specific Behavior (Minimal Format)

1.  **Standard Chat (`/chat`)**
    *   Response Body: Returns an array containing exactly **one** response object.
    *   `AuthorName`: MUST NOT be present.
    *   Must contain `Items` with a `Text` property OR a direct `Content` property.

2.  **Multi-Agent Batch Chat (`/multi-agent-chat/batch`)**
    *   Response Body: Returns an array containing **multiple** response objects.
    *   `AuthorName`: MUST be present in each response object.
    *   Each object must contain `Items` with a `Text` property OR a direct `Content` property.

3.  **Multi-Agent Streaming Chat (`/multi-agent-chat/stream`)**
    *   Uses Server-Sent Events (SSE).
    *   Each SSE `data:` payload contains **one** complete JSON response object (matching the minimal structure).
    *   `AuthorName`: MUST be present in each response object sent via SSE.
    *   Each object must contain `Items` with a `Text` property OR a direct `Content` property.

---

## Chat Request Format

The request format sent *to* the API remains unchanged:

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "latest message..." }
  ]
}
```

---

## History API

**Note:** The History API endpoints (`/chat-history`) have their own distinct request and response formats, which are **not** affected by the simplification of the *chat* response format described above. Please refer to the implementation or previous documentation for the History API contract details if needed.

---

## Implementation Examples

See the following examples for guidance on implementing the API endpoints:

- [C# Implementation](./examples/csharp.md)
- [Java Implementation](./examples/java.md)
- [Python Implementation](./examples/python.md) 
