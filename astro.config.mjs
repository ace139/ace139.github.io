import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ace139.github.io',
  base: '/',
  integrations: [tailwind()],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    },
    remarkPlugins: [],
    rehypePlugins: []
  }
});
