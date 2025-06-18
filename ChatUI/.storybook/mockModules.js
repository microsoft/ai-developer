// Mock modules that rely on Node.js specific features
if (typeof window !== 'undefined') {
  // Define __dirname in browser context
  window.__dirname = '';
  window.process = window.process || {};
  window.process.env = window.process.env || {};
  
  // Mock other Node.js globals as needed
  window.global = window;
  
  // Let's explicitly create the mocks before the modules are loaded
  // This is needed because OpenTelemetry API expects __dirname to be defined
  window.mockOpenTelemetry = {
    trace: {
      getTracer: () => ({
        startSpan: () => ({
          end: () => {},
        }),
      }),
    },
    context: { active: () => ({}) },
    propagation: { inject: () => {} },
  };
} 