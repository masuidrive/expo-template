import { default as expoConfig } from 'eslint-config-expo';

export default [
  ...expoConfig,
  {
    ignores: [
      'node_modules',
      '.expo',
      'dist',
      'web-build',
    ],
  },
];
