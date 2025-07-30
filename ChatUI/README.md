# Chat UI

A modern React chat application using Next.js that interacts with both standard and multi-agent chat completion API endpoints.

## Features

- Modern, visually appealing chat interface
- Two chat modes:
  - Standard chat (single agent)
  - Multi-agent chat (multiple specialized agents)
- Light and dark themes with custom color schemes
- Chat history management
- Responsive design for mobile and desktop
- Optional display of underlying tool/function call messages 🛠️
- OpenTelemetry instrumentation for observability

## Tech Stack

- Next.js with App Router
- TypeScript
- Material UI components
- Lucide icons
- Atomic Design principles
- Storybook for component development
- OpenTelemetry for monitoring and observability

## Getting Started

For detailed setup instructions, see the [Development Setup](./docs/setup/development.md) guide.

### Quick Start

1. Clone the repository
```bash
git clone <repository-url>
cd ChatUI
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with the configuration variables (see [API Configuration](./docs/api/configuration.md))

4. Run the development server
```bash
npm run dev
```

## Documentation

- **Setup**
  - [Development Setup](./docs/setup/development.md)
  - [Deployment Guide](./docs/setup/deployment.md)

- **API**
  - [API Configuration](./docs/api/configuration.md)
  - [Response Formats](./docs/api/response-formats.md)
  - **Implementation Examples**
    - [C# Implementation](./docs/api/examples/csharp.md)
    - [Java Implementation](./docs/api/examples/java.md)
    - [Python Implementation](./docs/api/examples/python.md)

- **Architecture**
  - [Service Design](./docs/architecture/service-design.md)
  - [Observability](./docs/architecture/observability.md)

## Architecture

The project follows the Atomic Design methodology:

- **Atoms**: Basic building blocks (Button, TextField, etc.)
- **Molecules**: Simple components made of atoms (ChatInput, MessageBubble)
- **Organisms**: More complex components (ChatHeader, ChatHistoryPanel)
- **Templates**: Page layouts (ChatPageLayout)
- **Pages**: Actual pages with data

## Services

Chat UI uses a service-based architecture:

- **IChatService**: Interface for chat API interactions
- **IHistoryService**: Interface for chat history management
- **MockChatService**: Mock implementation for development
- **LocalHistoryService**: In-memory history service for development

For production use, the mock services can be replaced with real API implementations without changing the application code. See the [Service Design](./docs/architecture/service-design.md) document for more details.

## Theme

The application supports both light and dark themes using custom color schemes. The theme can be toggled using the theme toggle in the chat header.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

For more information on the framework, you can check out the [Next.js GitHub repository](https://github.com/nextjs/next.js).

## Deploy on Azure

The application is configured to be deployed on Azure Static Web Apps, which provides a streamlined hosting service for modern web applications.

### Deployment Features

- GitHub Actions workflow for CI/CD
- Integrated CDN for fast global delivery
- Built-in API capabilities with Azure Functions
- Automatic HTTPS with SSL certificates
- Custom domain support

Deployment is handled through the GitHub Actions workflow defined in `.github/workflows/azure-static-web-apps.yml`.

Check out [Azure Static Web Apps documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/) for more details on deployment and configuration.

## Observability with OpenTelemetry

The application is instrumented with OpenTelemetry to provide observability insights into the application's behavior and performance. This helps in understanding the user experience, diagnosing issues, and optimizing performance.

### Key Features

- **Automatic Instrumentation**: Next.js framework operations are automatically instrumented
- **Custom Instrumentation**: Chat-specific telemetry for messages, agent mode changes, and API calls
- **Azure Monitor Integration**: Direct integration with Azure Application Insights
- **Performance Metrics**: Response times, component renders, and user interactions

### Configuration

OpenTelemetry is configured via environment variables:

```
NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING=your-connection-string
OTEL_LOG_LEVEL=info  # Options: error, warn, info, debug, trace
```

For detailed configuration options and instrumentation guide, see the [Observability](./docs/architecture/observability.md) documentation.
