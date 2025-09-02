/**
 * This script generates a _headers file for GitHub Pages with cache control directives
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
const headersContent = `# Cache static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Specific files flagged in PageSpeed Insights
/fonts/inter/Inter-Regular.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
/fonts/inter/Inter-Medium.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
/fonts/inter/Inter-SemiBold.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
/fonts/inter/Inter-Bold.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
/images/profile-256.webp
  Cache-Control: public, max-age=2592000
/images/profile-128.webp
  Cache-Control: public, max-age=2592000

# CORS headers for all font files
/fonts/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type

# Cache fonts
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
/*.woff
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
/*.ttf
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type

# Cache images
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

# Cache JS and CSS
/*.js
  Cache-Control: public, max-age=2592000, must-revalidate
/*.css
  Cache-Control: public, max-age=2592000, must-revalidate

# HTML - short cache time
/*.html
  Cache-Control: public, max-age=0, must-revalidate
/
  Cache-Control: public, max-age=0, must-revalidate

# Everything else
/*
  Cache-Control: public, max-age=3600
`;

// Write the _headers file to the dist directory
fs.writeFileSync(path.join(distDir, '_headers'), headersContent);

console.log('Generated _headers file with cache control directives');
