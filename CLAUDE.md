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

## Architecture Overview

This is an Astro 6 (beta) static site with TailwindCSS v4 and TypeScript. Deployed to Cloudflare Pages.

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
- `scripts/generate-headers.js` - Creates `dist/_headers` for caching (runs post-build)

### Third-Party Integrations

- **PostHog analytics**: `src/components/posthog.astro` - Uses `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` env vars
- **Mermaid diagrams**: Server-side rendered via `rehype-mermaid` in markdown
- **MDX support**: Via `@astrojs/mdx` integration

### Fonts

Loaded via `@fontsource/*` packages in Layout.astro:
- Playfair Display (headings)
- Roboto Slab
- Plus Jakarta Sans (body)
