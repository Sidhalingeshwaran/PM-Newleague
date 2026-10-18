import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Same Next.js rule sets as apps/pm-player-portal/eslint.config.mjs
 * ('next' + 'next/core-web-vitals'). The Nx workspace presets were dropped
 * because there is no Nx workspace in this standalone project.
 */
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...compat.extends('next', 'next/core-web-vitals'),
];

export default config;
