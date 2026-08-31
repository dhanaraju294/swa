// Jest for the pure-logic parts of the app (engine + state helpers).
// UI/React components are exercised by the end-to-end web check instead.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-typescript', { allExtensions: true }],
          ['@babel/preset-env', { targets: { node: 'current' } }],
        ],
      },
    ],
  },
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/async-storage.js',
  },
};
