import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const appBaseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';
const apiBaseUrl = process.env.E2E_API_URL || 'http://127.0.0.1:3000';
const suiteTarget = process.env.PW_SUITE || 'all';

const backendServer = {
    command: 'npm --prefix ../backend run dev',
    url: `${apiBaseUrl}/api/health`,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe' as const,
    stderr: 'pipe' as const,
    env: {
        ...process.env,
        PORT: '3000',
        CORS_ORIGIN: appBaseUrl,
        SKIP_DB: process.env.SKIP_DB || 'true'
    }
};

const frontendServer = {
    command: 'npm --prefix ../frontend run dev:e2e',
    url: appBaseUrl,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe' as const,
    stderr: 'pipe' as const,
    env: {
        ...process.env,
        VITE_API_URL: apiBaseUrl,
        VITE_SOCKET_URL: process.env.E2E_SOCKET_URL || apiBaseUrl
    }
};

export default defineConfig({
    testDir: './playwright/tests',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    reporter: [
        ['list'],
        ['html', { outputFolder: './reports/playwright', open: 'never' }]
    ],
    use: {
        baseURL: appBaseUrl,
        channel: process.env.PW_CHANNEL || 'chrome',
        headless: process.env.HEADLESS !== 'false',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    webServer: suiteTarget === 'api'
        ? [backendServer]
        : [backendServer, frontendServer]
});
