/**
 * This script generates a _headers file for Cloudflare Pages with cache control directives
 * for different types of static assets.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the dist directory
const distDir = path.join(__dirname, '../dist');

// Create the _headers file content
// Order: Most specific paths first, global rules last
const headersContent = `# Font files - specific file first, then directory
/fonts/inter-var.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type

# Hashed assets (immutable - Astro outputs to /_astro/)
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Legacy hashed JS bundles
/chunks/*.js
  Cache-Control: public, max-age=31536000, immutable

# Font files at root level
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
/*.woff
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
/*.ttf
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

# Images - 30 day cache
/*.jpg
  Cache-Control: public, max-age=2592000
/*.jpeg
  Cache-Control: public, max-age=2592000
/*.png
  Cache-Control: public, max-age=2592000
/*.gif
  Cache-Control: public, max-age=2592000
/*.webp
  Cache-Control: public, max-age=2592000
/*.svg
  Cache-Control: public, max-age=2592000
/*.ico
  Cache-Control: public, max-age=2592000

# HTML pages - no cache for fresh content
/*.html
  Cache-Control: public, max-age=0, must-revalidate

/
  Cache-Control: public, max-age=0, must-revalidate

# Global rules (security headers + default cache)
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://us.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://us.i.posthog.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Cache-Control: public, max-age=3600
`;

// Write the _headers file to the dist directory
try {
  fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
  console.log('Generated _headers file with cache control directives');
} catch (err) {
  console.error('Failed to write _headers:', err.message);
  process.exit(1);
}
