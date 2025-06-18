// Mock for @storybook/experimental-addon-test to fix Vitest integration issues

// Mock the afterEach function that's causing the error
export const afterEach = (fn) => {
  if (typeof fn === 'function' && typeof window !== 'undefined') {
    // We'll just store the functions but not call them
    if (!window.__mockTestCleanupFns) {
      window.__mockTestCleanupFns = [];
    }
    window.__mockTestCleanupFns.push(fn);
  }
};

// Mock the modifyErrorMessage function
export const modifyErrorMessage = () => {};

// Export other mocks as needed
export default {
  afterEach,
  modifyErrorMessage
}; 