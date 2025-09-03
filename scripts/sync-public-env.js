#!/usr/bin/env node
import { existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const envFile = resolve(root, '.env');
const publicEnvFile = resolve(root, '.env.public');

try {
  if (!existsSync(envFile) && existsSync(publicEnvFile)) {
    copyFileSync(publicEnvFile, envFile);
    console.log('[env] Created .env from .env.public');
  }
} catch (err) {
  console.warn('[env] Failed to sync .env from .env.public:', err?.message || err);
}

