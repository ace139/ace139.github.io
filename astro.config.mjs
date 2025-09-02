import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypeMermaid from 'rehype-mermaid';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ace139.github.io',
  base: '/',
  prefetch: true,
  integrations: [tailwind(), mdx()],
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
    build: {
      cssCodeSplit: true,
      reportCompressedSize: true,
      assetsInlineLimit: 4096,
      rollupOptions: {}
    },
    ssr: {
      noExternal: ['@astrojs/tailwind']
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
