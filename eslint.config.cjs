const typescript = require('@typescript-eslint/eslint-plugin');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['dist', 'node_modules', '*.cjs', '*.js'],
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
    },
    rules: {
      // TS recommended rules
      ...typescript.configs.recommended.rules,

      // Prettier config
      ...prettierConfig.rules,

      // Prefer TS-aware versions of rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'warn',

      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'warn',

      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'warn',

      // Optional: loosen return-type enforcement
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
