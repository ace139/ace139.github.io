# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design Context

Strategic design context lives in [`PRODUCT.md`](PRODUCT.md) (read it before UI work). In short:

- **Register**: brand. A personal site where design *is* the product (portfolio + long-form blog).
- **Who/why**: Soumyo Dey's personal brand home: a builder/systems thinker, a decade across AI, data, systems, and product, who writes about what holds up. Primary job is personal credibility in his own right; the site reflects more than any one company. He's currently Founder & CEO of [Oogway Labs](https://oogwaylabs.com/) (AI consulting/engineering), a present role surfaced on the About page and in the writing, but **not** the homepage headline.
- **Personality**: authoritative, direct, and quietly funny (*grounded, direct, wry*). Execution over hype, claims grounded in shipped work; a practitioner sharing understanding, never selling.
- **Anti-references**: AI-agency/consultancy hype (the headline one), generic SaaS landing, AI-slop/templated looks (no per-section tracked eyebrows, no cream-paper default), corporate/clinical sterility, loud hype marketing.

> Note: the earlier Cornet Health / dentist-burnout content (6 draft posts + `content-strategy/`) is a closed chapter being retired. The About page now lists Oogway Labs as current with Cornet as past; the résumé still needs updating.
- **Accessibility**: WCAG 2.2 AA across both light and dark themes (the theme follows the system preference until the reader toggles); reduced-motion alternatives for all load/scroll animation.

When DESIGN.md is generated (via `/impeccable document`), it captures the visual system (palette, type, components).

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

This is an Astro 7 static site with TailwindCSS v4 and TypeScript. Deployed to Cloudflare Pages.

### Content System

Content uses Astro's Content Layer API with glob loaders:

- **Blog posts**: `src/content/blog/*.md` - Schema in `src/content.config.ts` defines `title`, `subtitle?`, `date`, `heroImage?`, `tags?`, `description?`
- **Projects**: `src/content/projects/*.md` - Schema defines `title`, `description`, `date`, `heroImage?`, `tags?`, `github?`, `demo?`
- **Content routing**: `src/pages/blog/[...slug].astro` and `src/pages/projects/[...slug].astro` use `getCollection()` and `render()`

### Key Layouts & Components

- `src/layouts/Layout.astro` - Base layout with theme toggle, nav, footer, and all `<head>` SEO (canonical, Open Graph/Twitter, JSON-LD). Handles the theme: follows `prefers-color-scheme` unless `localStorage.theme` is set, via an inline pre-paint script that sets `html.light` or `html.dark`
- `src/layouts/BlogPost.astro` - Blog post wrapper: margin table of contents (≥3 `##` sections), reading progress, subscribe prompt, previous/next essay
- `src/layouts/ProjectPost.astro` - Project wrapper
- `src/components/ResponsiveImage.astro` - Wraps `astro:assets` Picture for AVIF/WebP with responsive widths
- Motion is CSS-only plus one small IntersectionObserver in Layout.astro: `.fade-up` (load-in, stagger via `--fade-delay`) and `.reveal` (on scroll; `data-animate-stagger` groups stagger their `data-animate-item` children). Both are gated on `html.motion-ok`, which is never set under reduced motion. No animation library.
- `src/pages/rss.xml.ts` - RSS feed of published posts

### Styling Architecture

- TailwindCSS v4 via `@tailwindcss/vite` plugin (not the Astro integration)
- Global styles in `src/styles/globals.css`
- Semantic CSS custom properties defined once with `light-dark()` in `@theme`: `--color-bg`, `--color-text`, `--color-primary`, etc.
- Light is the primary experience, dark an equal "night reading" mode; the system preference works without JS, `html.light`/`html.dark` pin it

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

Configured with Astro's Fonts API in `astro.config.mjs` (`fonts`), local provider. One superfamily: Source Serif 4 (roman + italic, wght and opsz axes) from `src/assets/fonts/` (Adobe release, SIL OFL, Latin subset that keeps `smcp`/`c2sc`/`onum` features; the @fontsource Latin subsets strip them). Exposed as `--font-source-serif` -> `--font-serif`/default family. UI is set in the same serif (small caps, italics); code uses the system monospace stack.
