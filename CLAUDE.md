# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development
bun install              # Install dependencies (uses Bun)
bun run dev              # Start dev server at localhost:4321
bun run preview          # Preview production build locally

# Build
bun run build            # Production build to ./dist/

# Quality
bun run lint             # Biome check (lint + format) all files
bun run lint:fix         # Auto-fix lint and format issues
bun run format           # Biome format all files
bun run format:check     # Check formatting without writing

# Analysis
bun run analyze          # Build with bundle analysis
```

## Code Quality & Linting

Linting and formatting are handled by **Biome** (via the **Ultracite** preset, `extends: ["ultracite/biome/astro"]` in `biome.json`). `bun run lint` must pass with **zero errors** before committing.

### `biome-ignore` policy

Do **not** add a `biome-ignore` (or `biome-ignore-all`, or a `biome.json` rule override) just to turn a check green. Always prefer fixing the underlying code. A suppression is only acceptable when there is a *genuine, specific reason* the rule does not apply, and that reason **must be written as the suppression's justification** (the text after the `:`), not left blank or generic.

Legitimate reasons look like:

- **Third-party / vendor code kept verbatim** — e.g. the official PostHog loader snippet in `src/components/posthog.astro` (`biome-ignore-all` for `noAssignInExpressions`, `noCommaOperator`, etc.).
- **Accessibility requirements that need `!important`** — e.g. the `prefers-reduced-motion` overrides in `src/styles/globals.css` must beat any animation rule regardless of specificity.
- **Verified false positives** — e.g. `noDescendingSpecificity` on selectors that target disjoint elements (`#main-nav a` vs `footer a`), where no real cascade conflict exists.

If you cannot articulate a concrete reason like the above, fix the code instead. "Saves time" or "makes CI pass" is never a valid reason.

## Architecture Overview

This is an Astro 6 static site with TailwindCSS v4 and TypeScript. Deployed to Cloudflare Pages.

### Content System

Content uses Astro's Content Layer API with glob loaders:

- **Blog posts**: `src/content/blog/*.md` - Schema in `src/content.config.ts` defines `title`, `subtitle?`, `date`, `heroImage?`, `tags?`, `description?`
- **Projects**: `src/content/projects/*.md` - Schema defines `title`, `description`, `date`, `heroImage?`, `tags?`, `github?`, `demo?`
- **Content routing**: `src/pages/blog/[...slug].astro` and `src/pages/projects/[...slug].astro` use `getCollection()` and `render()`

### Key Layouts & Components

- `src/layouts/Layout.astro` - Base layout with theme toggle, nav, footer. Handles dark mode (default) with `localStorage` persistence
- `src/layouts/BlogPost.astro` - Blog post wrapper
- `src/layouts/ProjectPost.astro` - Project wrapper
- `src/components/ResponsiveImage.astro` - Wraps `astro:assets` Picture for AVIF/WebP with responsive widths
- `src/scripts/gsap-setup.ts` - GSAP/ScrollTrigger animation utilities

### Styling Architecture

- TailwindCSS v4 via `@tailwindcss/vite` plugin (not the Astro integration)
- Global styles in `src/styles/globals.css`
- CSS custom properties for theming: `--color-bg-dark`, `--color-text-dark`, `--color-accent`, etc.
- Dark mode is default; `html.light` class triggers light theme

### Build Scripts (run automatically)

- `scripts/sync-public-env.js` - Copies `.env.public` → `.env` (runs pre-dev/start/build)
- `scripts/generate-llms-txt.js` - Generates `public/llms.txt` (runs pre-build)
- `scripts/generate-markdown.js` - Generates a `*.html.md` sibling for every built page (runs post-build)
- `scripts/generate-headers.js` - Creates `dist/_headers` for caching + security/Link headers (runs post-build)

### Markdown for Agents (content negotiation)

Requests with `Accept: text/markdown` receive a Markdown version of the page; browsers keep getting HTML. Implemented without paid Cloudflare features:

- `scripts/generate-markdown.js` converts each page's `<main>` content to Markdown at build time (`dist/<route>/index.html.md`).
- `functions/_middleware.js` is a Cloudflare Pages middleware that, on `Accept: text/markdown` page requests, serves the pre-generated `.md` with `Content-Type: text/markdown; charset=utf-8` and an `x-markdown-tokens` estimate. Non-page assets (`.css`, `.js`, `.txt`, `.xml`, images) and non-markdown requests pass through untouched. `Vary: Accept` is set on HTML pages so caches distinguish the two variants.
- Functions middleware is used (not a `dist/_worker.js`) specifically so the `_headers` file keeps applying. Verify changes locally with `bunx wrangler pages dev dist`.

### Third-Party Integrations

- **PostHog analytics**: `src/components/posthog.astro` - Uses `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` env vars
- **Mermaid diagrams**: Server-side rendered via `rehype-mermaid` in markdown
- **MDX support**: Via `@astrojs/mdx` integration

### Fonts

Loaded via `@fontsource/*` packages in Layout.astro:
- Playfair Display (headings)
- Roboto Slab
- Plus Jakarta Sans (body)
