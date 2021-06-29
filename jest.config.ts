import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'iql tests', outputDirectory: './reports', outputName: 'iql.xml' }],
  ],
  testPathIgnorePatterns: ['node_modules', 'dist'],
};

export default config;
