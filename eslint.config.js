// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // Reanimated exposes animation state via `sharedValue.value = ...`, which
      // is its documented, runtime-correct API. The React Compiler immutability
      // lint rule flags this mutation; we use Reanimated app-wide for press and
      // chart animations, so this specific rule is turned off intentionally.
      'react-hooks/immutability': 'off',
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
