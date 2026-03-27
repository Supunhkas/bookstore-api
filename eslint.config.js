import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig([
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'src/generated/',
      'prisma/',
      'prisma.config.ts',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierPlugin,

  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
]);
