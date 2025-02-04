module.exports = {
  preset: 'jest-expo', // or 'react-native' if you're not using Expo
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',  // This line should work now
  ],
  moduleDirectories: ['node_modules', 'react-native'],
};