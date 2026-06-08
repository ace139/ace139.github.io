import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
	site: "https://soumyo.com",
	base: "/",
	prefetch: true,
	integrations: [mdx(), sitemap()],
	output: "static",
	image: {
		// Astro 6.4 disabled SVG rasterization by default. Opt back in so SVG
		// hero sources (e.g. project cards) continue to be processed by <Picture>.
		dangerouslyProcessSVG: true,
	},
	build: {
		inlineStylesheets: "auto",
		assets: "assets",
		minify: true,
		splitting: true,
		rollupOptions: {
			output: {
				entryFileNames: "entry.[hash].js",
				chunkFileNames: "chunks/[name].[hash].js",
				assetFileNames: "assets/[name].[hash][extname]",
			},
		},
	},
	vite: {
		plugins: [tailwindcss()],
		build: {
			cssCodeSplit: true,
			reportCompressedSize: true,
			assetsInlineLimit: 4096,
			rollupOptions: {},
		},
	},
	markdown: {
		shikiConfig: {
			theme: {
				light: "github-light",
				dark: "github-dark",
			},
			wrap: true,
		},
		// Use rehype-mermaid (recommended replacement)
		remarkPlugins: [],
		rehypePlugins: [rehypeMermaid],
	},
	compressHTML: true,
});
