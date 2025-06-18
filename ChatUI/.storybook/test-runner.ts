// Basic configuration for test-runner that doesn't rely on @storybook/test-runner imports

// This is a simplified version to avoid dependency issues
const config = {
  async setup() {
    console.log('Setting up Storybook test environment');
  },
  
  async teardown() {
    console.log('Tearing down Storybook test environment');
  },
  
  async preRender(page: any) {
    // Wait for the page to be ready
    await page.waitForSelector('#storybook-root');
  },
  
  async postRender() {
    // Any custom post-render logic
  }
};

export default config; 