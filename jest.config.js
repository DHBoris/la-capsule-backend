module.exports = {
    testEnvironment: 'node',
    globalSetup: './__tests__/globalSetup.js',
    globalTeardown: './__tests__/globalTeardown.js',
    setupFilesAfterEnv: ['./__tests__/setup.js'],
    testMatch: ['**/__tests__/**/*.test.js'],
    testTimeout: 30000,
    verbose: true,
};
