import { PlaywrightTestConfig } from 'playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',  // Directory where Playwright will look for test files
  use: {
    headless: true,     // Run tests in headless mode by default
    viewport: { width: 1280, height: 720 },  // Set viewport size
    ignoreHTTPSErrors: true,
  },
};

export default config;
