import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    clearMocks: true,
    watch: false,
    projects: [
      {
        extends: true,
        test: {
          name: 'Browser Tests',
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
        extends: true,
        test: {
          name: 'Other Tests',
          environment: 'happy-dom',
          include: ['**/__tests__/**/*.test.ts'],
        }
      }
    ],
  }
});
