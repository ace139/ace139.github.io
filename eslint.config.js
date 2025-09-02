import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import astroPlugin from 'eslint-plugin-astro';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Ignore build and vendor outputs
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.netlify/**',
      'public/**',
      '.astro/**',
      '**/*.d.ts',
      'eslint.config.js',
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // Astro plugin (flat config)
  ...astroPlugin.configs['flat/recommended'],

  // TypeScript rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module', ecmaVersion: 'latest' },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Keep TS linting lightweight and avoid conflicting with Prettier
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
    },
  },

  // Import/order rules and resolver settings
  {
    files: ['**/*.{js,ts,astro}'],
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: true,
      },
    },
    rules: {
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index', 'object']],
        },
      ],
    },
  },

  // Astro files: disable import/order (formatter handles ordering)
  {
    files: ['**/*.astro'],
    rules: { 'import/order': 'off' },
  },

  // Node scripts: define Node globals and relax unused vars
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'no-undef': 'off',
    },
  },

  // Browser scripts: define browser globals
  {
    files: ['src/scripts/**/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
  },

  // Disable rules that conflict with Prettier formatting
  eslintConfigPrettier,
];
