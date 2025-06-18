/**
 * Get the application name from environment variables
 * This is a static value that's set at build time
 */
export const getAppName = (): string => {
  return process.env.NEXT_PUBLIC_APP_NAME || 'ChatUI';
}; 