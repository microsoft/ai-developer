// This file is loaded by Next.js when the instrumentation hook is enabled
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

let sdk: NodeSDK | undefined;

export async function register() {
  // Only set up OpenTelemetry in server environment
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Check if OpenTelemetry is disabled
      if (process.env.OTEL_SDK_DISABLED === 'true') {
        console.log('OpenTelemetry is disabled via OTEL_SDK_DISABLED=true');
        return;
      }
      
      // Check if the connection string is available
      const connectionString = process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING;
      
      if (!connectionString) {
        console.log('Skipping Azure Monitor OpenTelemetry setup: NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING is not defined');
        return;
      }
      
      // Validate the connection string format (basic check)
      if (!connectionString.includes('InstrumentationKey=') && !connectionString.includes('instrumentationkey=')) {
        console.log('Skipping Azure Monitor OpenTelemetry setup: Invalid connection string format');
        return;
      }
      
      const { AzureMonitorTraceExporter } = await import('@azure/monitor-opentelemetry-exporter');
      
      // Create Azure Monitor exporter
      const traceExporter = new AzureMonitorTraceExporter({
        connectionString,
      });
      
      // Define service resource
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'chat-ui',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production'
      });
      
      // Create SDK
      sdk = new NodeSDK({
        resource,
        traceExporter,
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': { enabled: true },
          }),
        ],
      });
      
      // Start SDK
      await sdk.start();
      console.log('Azure Monitor OpenTelemetry SDK initialized');
      
      // Handle graceful shutdown
      process.on('SIGTERM', () => {
        sdk?.shutdown()
          .then(() => console.log('OpenTelemetry SDK shut down'))
          .catch(err => console.error('Error shutting down OpenTelemetry SDK', err))
          .finally(() => process.exit(0));
      });
    } catch (error) {
      console.error('Failed to initialize Azure Monitor OpenTelemetry:', error);
    }
  }
} 