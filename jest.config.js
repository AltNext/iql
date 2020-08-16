module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
  ],
  testPathIgnorePatterns: ['node_modules', 'dist'],
};
