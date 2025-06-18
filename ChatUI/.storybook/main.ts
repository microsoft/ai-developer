import type { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  "framework": {
    "name": "@storybook/experimental-nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "..\\public"
  ],
  "viteFinal": async (config) => {
    // Add any Vite-specific configuration to better handle CSS
    config.css = {
      ...config.css,
      postcss: {
        plugins: [],  // Let it use the project's postcss.config.js
      },
    };
    
    // Ensure Tailwind is properly resolved
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        // Mock OpenTelemetry API to avoid __dirname issues
        '@opentelemetry/api': path.resolve(__dirname, './mocks/opentelemetry.js'),
        // Mock ServiceProvider for Storybook
        '@/services/ServiceProvider': path.resolve(__dirname, './mocks/ServiceProvider.js'),
        // Mock ServiceFactory as well
        '@/services/ServiceFactory': path.resolve(__dirname, './mocks/ServiceProvider.js'),
      };
    }
    
    // Add Node.js polyfills for browser environment
    config.define = {
      ...config.define,
      '__dirname': JSON.stringify(''),
      'process.env': {},
    };
    
    return config;
  }
};
export default config;