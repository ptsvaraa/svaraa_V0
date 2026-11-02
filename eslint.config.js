const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expo,
  prettier,
  { ignores: ['dist/*', '.expo/*', 'services/api/schema.d.ts', 'public/mockServiceWorker.js'] },
  {
    // app/ = screens only. Outside calls go through services/.
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'openapi-fetch',
              message: 'Screens must not call the backend. Use a hook from features/ or services/.',
            },
            { name: 'expo-secure-store', message: 'Storage goes through services/storage.' },
            { name: 'react-native-ble-plx', message: 'Bluetooth goes through services/pendant.' },
          ],
        },
      ],
    },
  },
]);
