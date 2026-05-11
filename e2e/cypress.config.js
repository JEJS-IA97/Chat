const path = require('node:path');
const dotenv = require('dotenv');
const { defineConfig } = require('cypress');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';
const apiUrl = process.env.E2E_API_URL || 'http://127.0.0.1:3000';

let testCount = 0;

module.exports = defineConfig({
    e2e: {
        baseUrl,
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: 'cypress/support/e2e.js',
        fixturesFolder: 'fixtures',
        env: {
            apiUrl
        },
        setupNodeEvents(on, config) {
            on('task', {
                getNextId() {
                    testCount++;
                    return testCount.toString().padStart(2, '0');
                }
            });
        }
    },
    viewportWidth: 1440,
    viewportHeight: 900,
    video: true,
    screenshotsFolder: 'reports/cypress/screenshots',
    videosFolder: 'reports/cypress/videos',
    downloadsFolder: 'reports/cypress/downloads'
});
