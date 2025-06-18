# Development Setup

This document provides instructions for setting up the Chat UI application for local development.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chat-ui
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:
```
# Chat API endpoints - will be used for production builds
NEXT_PUBLIC_STANDARD_CHAT_API_URL=https://api.example.com/chat
NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL=https://api.example.com/multi-agent-chat
NEXT_PUBLIC_CHAT_HISTORY_API_URL=https://api.example.com/chat-history

# Development mode settings
# Standard chat API mode - set to 'mock' to use mock service or 'api' to use actual endpoint
NEXT_PUBLIC_STANDARD_CHAT_API_MODE=mock

# Multi-agent chat API mode - set to 'mock' to use mock service or 'api' to use actual endpoint
NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE=mock

# Multi-agent response mode - set to 'stream' for real-time streaming responses or 'batch' for complete history in a single response
NEXT_PUBLIC_MULTI_AGENT_RESPONSE_MODE=stream

# Chat history mode - set to 'local' to use in-browser session storage or 'api' to use the chat history API endpoint
NEXT_PUBLIC_CHAT_HISTORY_MODE=local

# Application name - will default to "ChatUI" if not provided
NEXT_PUBLIC_APP_NAME=YourAppName
```

For more detailed information about environment variables, see the [API Configuration](../api/configuration.md) documentation.

## Running the Development Server

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Storybook

The project uses Storybook for component development and testing. Run Storybook with:
```bash
npm run storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Development Workflow

### Mock Services

By default, the application uses mock services for development, which simulate responses without requiring real API endpoints. The mock services are located in:

- `src/services/MockChatService.ts`: Simulates chat responses
- `src/services/MockHistoryService.ts`: Simulates chat history storage

### Service Factory

The application uses a factory pattern for service instantiation, located in `src/services/ServiceFactory.ts`. This allows the application to switch between mock and real API services based on environment variables without changing the application code.

### Testing API Integration

To test your own API implementation:

1. Set up your API endpoint according to the [API Response Formats](../api/response-formats.md) document
2. Update your `.env.local` file to use your API:
   ```
   NEXT_PUBLIC_STANDARD_CHAT_API_URL=http://localhost:your-port/your-endpoint
   NEXT_PUBLIC_STANDARD_CHAT_API_MODE=api
   ```
3. Run the development server and test the integration

## Working with TypeScript

The project uses TypeScript for type safety. Key type definitions are located in:

- `src/services/IChatService.ts`: Interface for chat services
- `src/services/IHistoryService.ts`: Interface for history services
- `src/components/molecules/ChatMessagePanel.ts`: Message interface definitions

## Building for Production

To build the application for production:
```bash
npm run build
```

You can preview the production build with:
```bash
npm run start
```

## Deployment

This application is configured for deployment to Azure Static Web Apps. The deployment process is automated through GitHub Actions.

For detailed deployment instructions, including environment variable management and Azure Key Vault integration, please refer to the [Deployment Guide](./deployment.md).

For more information on Azure Static Web Apps, refer to the [Azure Static Web Apps documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/). 