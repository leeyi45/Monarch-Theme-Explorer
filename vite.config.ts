import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    watch: false,
    projects: [
      {
        test: {
          name: 'Browser Tests',
          clearMocks: true,
          include: ['**/__tests__/**/*.test.tsx'],
          browser: {
            provider: playwright(),
            enabled: true,
            screenshotFailures: false,
            instances: [ { browser: 'chromium' } ]
          }
        }
      },
      {
        test: {
          name: 'Other Tests',
          clearMocks: true,
          environment: 'happy-dom',
          include: ['**/__tests__/**/*.test.ts'],
          browser: { enabled: false }
        }
      }
    ],
  }
});
