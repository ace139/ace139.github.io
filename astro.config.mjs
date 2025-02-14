import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ace139.github.io',
  base: '/',
  integrations: [tailwind()],
  output: 'static',
  build: {
    inlineStylesheets: 'always',
    assets: 'assets',
    minify: true,
    splitting: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
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
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [/node_modules/]
          }
        }
      }
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
    // Only include plugins we actually use
    remarkPlugins: [],
    rehypePlugins: []
  },
  compressHTML: true
});
