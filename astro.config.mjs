import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

/**
 * Self-hosted variable font from a file in the repo. Source Serif 4 is the
 * Adobe release (SIL OFL), subset to Latin with its OpenType features kept
 * (smcp/c2sc small caps, onum/lnum figures). The @fontsource Latin subsets
 * strip those features, so they cannot supply real small caps.
 * One file per style keeps preloading exact.
 */
function variableFamily({ name, cssVariable, files, fallbacks }) {
	return {
		provider: fontProviders.local(),
		name,
		cssVariable,
		fallbacks,
		options: {
			variants: files.map(({ src, weight, style }) => ({
				src: [src],
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
			name: "Source Serif 4",
			cssVariable: "--font-source-serif",
			files: [
				{
					src: "./src/assets/fonts/source-serif-4-roman.woff2",
					weight: "400 700",
					style: "normal",
				},
				{
					src: "./src/assets/fonts/source-serif-4-italic.woff2",
					weight: "400 600",
					style: "italic",
				},
			],
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
			// Emit both palettes as CSS variables only; globals.css picks one
			// with light-dark(), so code follows the page theme.
			defaultColor: false,
			wrap: true,
		},
		// Remark/rehype plugins now live on the processor; the bare
		// `remarkPlugins`/`rehypePlugins` keys are deprecated in Astro 6.4.
		processor: unified({ rehypePlugins: [rehypeMermaid] }),
	},
	compressHTML: true,
});
