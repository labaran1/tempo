const nextJest = require('next/jest');
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  watchPathIgnorePatterns: ['<rootDir>/test/e2e/'],

};
module.exports = createJestConfig(customJestConfig);
