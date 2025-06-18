// Mock implementation of OpenTelemetry API for browser environments
export const trace = {
  getTracer: () => ({
    startSpan: () => ({
      end: () => {},
      setAttribute: () => {},
      setAttributes: () => {},
      recordException: () => {},
      updateName: () => {},
      isRecording: () => false,
    }),
  }),
  setSpan: () => {},
  wrapSpanContext: () => {},
  getSpan: () => null,
  getActiveSpan: () => null,
  StatusCode: {
    ERROR: 'ERROR',
    OK: 'OK',
    UNSET: 'UNSET',
  },
  SpanStatusCode: {
    ERROR: 'ERROR',
    OK: 'OK',
    UNSET: 'UNSET',
  },
  SpanKind: {
    INTERNAL: 'INTERNAL',
    SERVER: 'SERVER',
    CLIENT: 'CLIENT',
    PRODUCER: 'PRODUCER',
    CONSUMER: 'CONSUMER',
  },
};

export const context = {
  active: () => ({}),
  bind: (context, target) => target,
  with: (context, callback) => callback(),
};

export const propagation = {
  inject: () => {},
  extract: () => ({}),
};

// Default export for CommonJS compatibility
export default {
  trace,
  context,
  propagation,
}; 