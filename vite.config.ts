import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    clearMocks: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    browser: {
      provider: playwright(),
      enabled: true,
      screenshotFailures: false,
      instances: [
        { browser: 'chromium' }
      ]
    }
  }
});
