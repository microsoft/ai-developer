# API Configuration Guide

This document explains how to configure the chat application to use real API endpoints instead of mock services.

## Environment Variables

The application uses environment variables to determine which API endpoints to use and which service modes to enable. These can be configured in `.env.local` and other environment-specific files.

### API URLs

| Environment Variable | Description | Default Value |
|---------------------|-------------|---------------|
| `NEXT_PUBLIC_STANDARD_CHAT_API_URL` | The URL for standard chat API | `https://api.example.com/chat` |
| `NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL` | The URL for multi-agent chat API | `https://api.example.com/multi-agent-chat` |
| `NEXT_PUBLIC_CHAT_HISTORY_API_URL` | The URL for chat history management API | `https://api.example.com/chat-history` |

### Service Modes

| Environment Variable | Possible Values | Description |
|---------------------|-----------------|-------------|
| `NEXT_PUBLIC_STANDARD_CHAT_API_MODE` | `mock`, `api` | Controls whether standard chat uses mock or real API |
| `NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE` | `mock`, `api` | Controls whether multi-agent chat uses mock or real API |
| `NEXT_PUBLIC_MULTI_AGENT_RESPONSE_MODE` | `stream`, `batch` | Controls whether multi-agent chat uses streaming or batch responses |
| `NEXT_PUBLIC_CHAT_HISTORY_MODE` | `local`, `api` | Controls whether chat history uses local storage or real API |

## Configuring for Development

For local development, you can mix and match service modes to test different parts of the application:

```
# Example .env.local for development with local history but real chat APIs
NEXT_PUBLIC_STANDARD_CHAT_API_URL=https://your-api.com/chat
NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL=https://your-api.com/multi-agent-chat
NEXT_PUBLIC_CHAT_HISTORY_MODE=local
NEXT_PUBLIC_STANDARD_CHAT_API_MODE=api
NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE=api
NEXT_PUBLIC_MULTI_AGENT_RESPONSE_MODE=stream
```

## Configuring for Production

For production, you should typically use the API modes for all services:

```
# Example .env.production
NEXT_PUBLIC_STANDARD_CHAT_API_URL=https://api.yourproduction.com/chat
NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL=https://api.yourproduction.com/multi-agent-chat
NEXT_PUBLIC_CHAT_HISTORY_API_URL=https://api.yourproduction.com/chat-history
NEXT_PUBLIC_CHAT_HISTORY_MODE=api
NEXT_PUBLIC_STANDARD_CHAT_API_MODE=api
NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE=api
NEXT_PUBLIC_MULTI_AGENT_RESPONSE_MODE=stream
```

## Implementing Your Own API Integration

For details on API request and response formats, see the [Response Formats](./response-formats.md) documentation.

For code examples of API implementations in different languages, check the examples folder:
- [C# Implementation](./examples/csharp.md)
- [Java Implementation](./examples/java.md)
- [Python Implementation](./examples/python.md) 