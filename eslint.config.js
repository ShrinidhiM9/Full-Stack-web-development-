// eslint.config.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  rules: {
    // Example rules — customize as you like
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'no-unused-vars': 'warn',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'react/prop-types': 'off', // optional, if using TypeScript or no prop-types
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
