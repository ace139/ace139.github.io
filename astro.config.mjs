import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

/**
 * Self-hosted variable font from an installed @fontsource-variable package.
 * Latin subset only: the site is English, and one file per style keeps
 * preloading exact (rare glyphs fall back to the system face).
 */
function variableFamily({ name, cssVariable, pkg, weight, styles, fallbacks }) {
	return {
		provider: fontProviders.local(),
		name,
		cssVariable,
		fallbacks,
		options: {
			variants: styles.map((style) => ({
				src: [
					`./node_modules/@fontsource-variable/${pkg}/files/${pkg}-latin-wght-${style}.woff2`,
				],
				weight,
				style,
			})),
		},
	};
}

export default defineConfig({
	site: "https://soumyo.com",
	base: "/",
	prefetch: true,
	integrations: [mdx(), sitemap()],
	output: "static",
	// Astro generates @font-face rules, preload links, and size-adjusted
	// fallback faces (so text doesn't shift when the web font swaps in).
	fonts: [
		variableFamily({
			name: "Plus Jakarta Sans",
			cssVariable: "--font-jakarta",
			pkg: "plus-jakarta-sans",
			weight: "200 800",
			styles: ["normal"],
			fallbacks: ["system-ui", "sans-serif"],
		}),
		variableFamily({
			name: "Newsreader",
			cssVariable: "--font-newsreader",
			pkg: "newsreader",
			weight: "200 800",
			styles: ["normal", "italic"],
			fallbacks: ["Georgia", "serif"],
		}),
	],
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
		// `shikiConfig`/`syntaxHighlight` stay top-level — Astro applies
		// syntax highlighting outside the markdown processor.
		shikiConfig: {
			theme: {
				light: "github-light",
				dark: "github-dark",
			},
			wrap: true,
		},
		// Remark/rehype plugins now live on the processor; the bare
		// `remarkPlugins`/`rehypePlugins` keys are deprecated in Astro 6.4.
		processor: unified({ rehypePlugins: [rehypeMermaid] }),
	},
	compressHTML: true,
});
