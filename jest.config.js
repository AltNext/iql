module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    ['jest-junit', { suiteName: 'norm tests', outputDirectory: './reports', outputName: 'norm.xml' }],
  ],
  testPathIgnorePatterns: ['node_modules', 'dist'],
};
