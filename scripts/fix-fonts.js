import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

/**
 * This script does the following:
 * 1. Verifies that font files exist and are in the correct format
 * 2. Creates a .headers file with proper CORS headers if needed
 */

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../public/fonts');
const HEADERS_FILE = path.join(__dirname, '../_headers');

// Function to check if a file is a valid font file
function checkFontFile(fontPath) {
  console.log(`Checking font file: ${fontPath}`);

  if (!fs.existsSync(fontPath)) {
    console.error(`Font file not found: ${fontPath}`);
    return false;
  }

  // Check file size (should be at least 10KB for a font file)
  const stats = fs.statSync(fontPath);
  if (stats.size < 10 * 1024) {
    console.error(`Font file too small, might be corrupted: ${fontPath} (${stats.size} bytes)`);
    return false;
  }

  // All checks passed
  console.log(`Font file looks good: ${fontPath} (${stats.size} bytes)`);
  return true;
}

// Main function
async function main() {
  console.log('Starting font fix...');

  // Create fonts directory if it doesn't exist
  if (!fs.existsSync(FONTS_DIR)) {
    console.log(`Creating fonts directory: ${FONTS_DIR}`);
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  // Check for Inter variable font
  const interVarPath = path.join(FONTS_DIR, 'inter-var.woff2');
  const interVarExists = checkFontFile(interVarPath);

  // Add headers file with CORS settings
  console.log('Adding CORS headers for font files...');
  
  // Create or update _headers file in the root directory for Netlify
  fs.writeFileSync(HEADERS_FILE, `
# CORS headers for font files
/fonts/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type

# Specific font files
/fonts/inter-var.woff2
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET
  Access-Control-Allow-Headers: Content-Type
  Cache-Control: public, max-age=31536000, immutable
`);

  console.log('Headers file created/updated.');
  console.log('Font fix script completed.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
