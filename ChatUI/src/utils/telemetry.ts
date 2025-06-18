// OpenTelemetry utilities for custom instrumentation
import { trace, SpanStatusCode } from '@opentelemetry/api';

// Get the OpenTelemetry tracer
const tracer = trace.getTracer('chat-ui-custom-instrumentation');

/**
 * Creates and manages a custom span for tracking specific operations
 * 
 * @param name The name of the span
 * @param fn The function to execute within the span context
 * @param attributes Optional attributes to add to the span
 * @returns The result of the function execution
 */
export function traceOperation<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      // Add any custom attributes to the span
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });

      // Execute the function
      const result = await fn();
      
      // Mark the span as successful
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
    } catch (error) {
      // Record the error
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      
      // Record the stack trace if available
      if (error instanceof Error && error.stack) {
        span.setAttribute('error.stack', error.stack);
      }
      
      // Rethrow the error
      throw error;
    } finally {
      // End the span
      span.end();
    }
  });
}

/**
 * Tracks a user interaction like sending a message or changing modes
 * 
 * @param action The user action being performed
 * @param details Additional details about the action
 */
export function trackUserAction(
  action: string,
  details: Record<string, string | number | boolean> = {}
): void {
  tracer.startActiveSpan(`user.action.${action}`, (span) => {
    try {
      // Add the details as attributes
      Object.entries(details).forEach(([key, value]) => {
        span.setAttribute(`user.action.${key}`, value);
      });
      
      // Add timestamp
      span.setAttribute('timestamp', Date.now());
      
      // Mark as successful
      span.setStatus({ code: SpanStatusCode.OK });
    } finally {
      // End the span
      span.end();
    }
  });
}

/**
 * Tracks API request performance and results
 * 
 * @param endpoint The API endpoint being called
 * @param fn The function making the API call
 * @param details Additional details about the request
 * @returns The result of the API call
 */
export function trackApiCall<T>(
  endpoint: string,
  fn: () => Promise<T>,
  details: Record<string, string | number | boolean> = {}
): Promise<T> {
  return tracer.startActiveSpan(`api.request.${endpoint}`, async (span) => {
    const startTime = Date.now();
    
    try {
      // Add the details as attributes
      Object.entries(details).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
      
      // Execute the API call
      const result = await fn();
      
      // Add response time
      const duration = Date.now() - startTime;
      span.setAttribute('api.response.time_ms', duration);
      
      // Mark as successful
      span.setStatus({ code: SpanStatusCode.OK });
      
      return result;
    } catch (error) {
      // Record the error
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error),
      });
      
      // Add response time even for errors
      const duration = Date.now() - startTime;
      span.setAttribute('api.response.time_ms', duration);
      
      // Add error details
      if (error instanceof Error) {
        span.setAttribute('error.type', error.name);
        span.setAttribute('error.message', error.message);
        if (error.stack) {
          span.setAttribute('error.stack', error.stack);
        }
      }
      
      // Rethrow the error
      throw error;
    } finally {
      // End the span
      span.end();
    }
  });
}

/**
 * Tracks component render performance
 * 
 * @param componentName The name of the component
 * @param details Additional details about the component
 * @returns A function to call when the component unmounts
 */
export function trackComponentRender(
  componentName: string,
  details: Record<string, string | number | boolean> = {}
): () => void {
  const span = tracer.startSpan(`component.render.${componentName}`);
  
  // Add the details as attributes
  Object.entries(details).forEach(([key, value]) => {
    span.setAttribute(key, value);
  });
  
  // Record the start time
  const renderStartTime = Date.now();
  span.setAttribute('render.start_time', renderStartTime);
  
  // Return a function to call when the component unmounts
  return () => {
    try {
      // Record the end time and duration
      const endTime = Date.now();
      
      // Use the saved value directly instead of trying to access span attributes
      // This avoids the error where span.attributes might not be accessible
      span.setAttribute('render.end_time', endTime);
      span.setAttribute('render.duration_ms', endTime - renderStartTime);
      
      // Mark as successful
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      // Silently handle any errors during telemetry recording
      console.debug('Telemetry error in component tracking:', error);
    } finally {
      // Always end the span
      span.end();
    }
  };
}

/**
 * Track a chat message being sent
 * 
 * @param content The message content
 * @param agentMode The current agent mode
 */
export function trackMessageSent(content: string, agentMode: 'standard' | 'multiAgent'): void {
  tracer.startActiveSpan('send-message', (span) => {
    try {
      span.setAttribute('message.length', content.length);
      span.setAttribute('agent.mode', agentMode);
      span.setAttribute('message.timestamp', Date.now());
      span.setStatus({ code: SpanStatusCode.OK });
    } finally {
      span.end();
    }
  });
}

/**
 * Track agent mode changes
 * 
 * @param newMode The new agent mode
 * @param previousMode The previous agent mode
 */
export function trackAgentModeChange(
  newMode: 'standard' | 'multiAgent',
  previousMode: 'standard' | 'multiAgent'
): void {
  tracer.startActiveSpan('agent-mode-change', (span) => {
    try {
      span.setAttribute('agent.new_mode', newMode);
      span.setAttribute('agent.previous_mode', previousMode);
      span.setAttribute('agent.change_timestamp', Date.now());
      span.setStatus({ code: SpanStatusCode.OK });
    } finally {
      span.end();
    }
  });
} 