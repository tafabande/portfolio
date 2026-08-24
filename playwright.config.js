// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  fullyParallel: true,
  workers: 4,

  forbidOnly: !!process.env.CI,
  retries: 0,

  reporter: [
    ['list']
  ],

  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'node server.js',
    port: 8080,
    reuseExistingServer: true,
    timeout: 10 * 1000,
  },
});
