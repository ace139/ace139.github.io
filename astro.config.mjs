import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeMermaid from 'rehype-mermaid';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://soumyo.com',
  base: '/',
  prefetch: true,
  integrations: [mdx(), sitemap()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
    minify: true,
    splitting: true,
    rollupOptions: {
      output: {
        entryFileNames: 'entry.[hash].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      reportCompressedSize: true,
      assetsInlineLimit: 4096,
      rollupOptions: {}
    },
    optimizeDeps: {
      exclude: ['@astrojs/image', 'sharp']
    }
  },
  markdown: {
    shikiConfig: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    },
    // Use rehype-mermaid (recommended replacement)
    remarkPlugins: [],
    rehypePlugins: [rehypeMermaid]
  },
  compressHTML: true
});
