import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Using a simpler configuration without the experimental Storybook test addon
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['.storybook/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', '.next', 'out', '.git'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.storybook/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      // Mock the OpenTelemetry API during tests
      '@opentelemetry/api': path.resolve(dirname, './.storybook/mocks/opentelemetry.js')
    }
  }
});
