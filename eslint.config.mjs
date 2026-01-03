import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { featureFlagsValidation } from './devtools/eslint/feature-flags-validation.mjs';
import tsParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      local: {
        rules: {
          'feature-flags-validation': featureFlagsValidation,
        },
      },
    },
    rules: {
      'local/feature-flags-validation': 'error',
    },
    files: ['**/*.ts', '**/*.tsx'], // Changed to include all TypeScript files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];

export default eslintConfig;
