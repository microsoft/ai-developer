// Basic Vitest setup for Storybook tests without experimental-addon integration
import { beforeAll } from 'vitest';
import * as projectAnnotations from './preview';

if (typeof window !== 'undefined') {
  // Mock browser APIs for testing environment
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    };
  };

  // Additional browser mocks if needed for test environment
  window.scrollTo = () => {};
  window.resizeTo = () => {};
}

// These are basic setups that don't try to use the experimental integration
beforeAll(() => {
  console.log('Setting up Storybook test environment');
});