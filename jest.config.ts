import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  coverageReporters: [
    'lcov',
    'text',
    'text-summary'
  ],
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'norm tests', outputDirectory: './reports', outputName: 'norm.xml' }],
  ],
  testPathIgnorePatterns: ['node_modules', 'dist'],
};

export default config;
