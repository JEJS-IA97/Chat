const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseUrl = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';

module.exports = {
    ci: {
        collect: {
            url: [baseUrl],
            numberOfRuns: 1
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.6 }],
                'categories:accessibility': ['warn', { minScore: 0.8 }],
                'categories:best-practices': ['warn', { minScore: 0.8 }]
            }
        },
        upload: {
            target: 'filesystem',
            outputDir: './reports/lighthouse'
        }
    }
};
