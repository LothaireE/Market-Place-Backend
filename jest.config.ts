import type { Config } from 'jest';

// This configuration is set up for a Node.js environment using TypeScript with Jest.
// It specifies the test environment, the root directory for tests, and some performance optimizations.

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    maxWorkers: 1,
    detectOpenHandles: true
};

export default config;
