import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ace139.github.io',
  base: '/',
  integrations: [tailwind()],
  output: 'static',
  build: {
    // Enable inlining of smaller assets
    inlineStylesheets: 'auto'
  },
  markdown: {
    shikiConfig: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    },
    // Only include plugins we actually use
    remarkPlugins: [],
    rehypePlugins: []
  },
  compressHTML: true
});
