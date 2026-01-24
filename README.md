# Personal Portfolio Website

A modern, responsive personal portfolio website built with Astro 6 (beta), TailwindCSS, and TypeScript. Uses Bun as the package manager and runtime. Features dark mode support, dynamic social media links, and a clean, minimalist design with optimized performance. Deployed on Cloudflare Pages.

## 🌟 Features

- 🎨 **Responsive Design**: Mobile-first, clean UI with TailwindCSS
- 🌓 **Dark/Light Mode**: System preference + manual toggle without flashes
- 🔗 **Dynamic Social Links**: Centralized in `src/config/socials.ts`
- 🖼️ **Images via astro:assets**:
  - `ResponsiveImage.astro` wraps `Picture` for AVIF/WebP + original fallback
  - SVG/string paths fall back to `<img>` automatically
  - Homepage avatar now uses `Picture` with responsive variants
- 🧩 **MDX Support**: Write content in `.mdx`, import images, and embed components
- 🐟 **Mermaid Diagrams**: Enabled using `rehype-mermaid` in Markdown
- ⚡ **Performance**: Minimal JS, code-splitting, responsive images
- 📦 **Caching & Headers**: Cloudflare Pages with optimized caching
- 🛠 **Type Safety**: TypeScript across content & components

## 🏗 Architecture

```mermaid
graph TD
    A[Layout.astro] --> B[index.astro]
    B --> C[Social Links]
    B --> D[Theme Toggle]

    C --> E[socials.ts]
    D --> F[Theme Management]

    F --> G[System Preference]
    F --> H[Manual Toggle]
    F --> I[LocalStorage]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style E fill:#dfd,stroke:#333,stroke-width:2px
```

## 📁 Project Structure

```
/
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.svg
├── scripts/
│   ├── optimize-images.js        # prebuild image optimization
│   └── fix-fonts.js
├── src/
│   ├── components/
│   │   ├── ResponsiveImage.astro
│   │   ├── FontOptimizer.astro
│   │   ├── SocialIcons.astro
│   │   └── Icons.astro
│   ├── content/
│   │   ├── blog/                  # .md or .mdx files
│   │   ├── projects/              # .md or .mdx files
│   │   └── config.ts              # collections schema
│   ├── images/
│   │   └── avatar.jpg             # homepage avatar (astro:assets)
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── BlogPost.astro
│   │   └── ProjectPost.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── blog.astro
│   │   ├── blog/[...slug].astro
│   │   ├── projects.astro
│   │   ├── projects/[...slug].astro
│   │   └── tags/[tag].astro
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── README.md
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure social media links**
   Edit `src/config/socials.ts`:

   ```typescript
   export const socials: Social[] = [
     {
       platform: 'github',
       url: 'https://github.com/yourusername',
       label: 'GitHub',
     },
     // Add more social links...
   ];
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

## 📈 Analytics (PostHog)

This site uses PostHog for privacy-friendly web analytics.

- Location: `src/components/posthog.astro` is included once in the base layout (`src/layouts/Layout.astro`).
- Client env vars: Only `PUBLIC_*` variables are exposed to the browser. We use:
  - `PUBLIC_POSTHOG_KEY`: your PostHog Project API key
  - `PUBLIC_POSTHOG_HOST`: API host (default `https://us.i.posthog.com`, EU: `https://eu.i.posthog.com`)
- Env files:
  - `.env.public` (committed): holds safe public values. Used for both dev and production builds.
  - `.env.example` (committed): template with placeholders for new environments.
  - `.env` (gitignored): created automatically from `.env.public` if missing.
- Loading mechanism:
  - A small script (`scripts/sync-public-env.js`) runs before dev/start/build to copy `.env.public` → `.env` if `.env` is missing so Vite/Astro load the values.
  - You can also set `PUBLIC_POSTHOG_*` directly in your hosting provider’s environment variables.

Quick start:

1) Set your key in `.env.public` (or host env):
   ```env
   PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXXXXXXXXXXXXXXXX
   PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
2) Run `bun run dev` and open the site. Events are enabled in dev for easy testing.
3) Deploy and set the same env variables in your hosting UI.

Notes:
- The key is intentionally public; PostHog client keys are safe to expose.
- If you want to filter dev vs prod traffic in PostHog, you can register an env tag after init:
  ```js
  posthog.register({ env: import.meta.env.MODE })
  ```

## 🛠 Core Components

### Performance Components

#### ResponsiveImage.astro

- High-level wrapper over `astro:assets` `Picture`
- Inputs `ImageMetadata | string`; auto-falls back to `<img>` for SVG/string
- Responsive widths default: `[320, 480, 768, 1024, 1280]`
- Formats default: `['avif', 'webp']` plus original format fallback
- Props: `sizes?`, `widths?`, `formats?`, `loading?`, `fetchpriority?`

#### FontOptimizer.astro

- Font loading optimization
- Variable font support
- Loading state management
- Font fallback handling
- Performance monitoring

#### ScriptOptimizer.astro

- Third-party script management
- Priority-based loading
- Resource hint implementation
- Performance budgeting
- User interaction tracking

### Core Layout Components

### Layout (Layout.astro)

- Base template for all pages
- Implements navigation and theme toggle
- Handles dark mode functionality with optimized JavaScript
- Responsive design implementation

### Homepage (index.astro)

- Main landing page with optimized avatar via `Picture` (AVIF/WebP + responsive)
- Dynamic social links with inline SVG icons
- Responsive layout with dark mode

### Icons System (Icons.astro)

- Optimized SVG icons instead of external icon libraries
- Zero external dependencies for icons
- TypeScript-powered type safety for icon names
- Customizable through CSS classes
- Accessible and performant

### Social Media Configuration (socials.ts)

- TypeScript interface for social media entries
- Centralized configuration for all social links
- SVG icon integration
- Easy to extend and modify

### Theme Management

- Optimized theme switching with minimal JavaScript
- System preference detection
- Manual theme toggle
- Persistent theme selection using localStorage
- Prevents flash of incorrect theme

### Image Optimization (optimize-images.js)

- WebP format support with JPEG fallback
- Multiple sizes for responsive images (1x and 2x)
  - Proper width and height attributes to prevent layout shifts
  - Lazy loading for off-screen images
  - Astro's built-in image optimization
- Automated optimization script

## 📝 Content Authoring (Blog & Projects with MDX)

Content lives in `src/content/blog/` and `src/content/projects/`, defined by `src/content/config.ts` with schema-validated frontmatter using `image()`.

- __Frontmatter schema__ (`src/content/config.ts`):
  - Blog: `title` (string), `date` (string), `heroImage` (image optional), `tags?`, `description?`
  - Projects: `title`, `description`, `date`, `heroImage?`, `tags?`, `github?`, `demo?`

- __Create a new blog post__
  1) Create a folder with media next to it (recommended):
     - `src/content/blog/my-post/index.mdx`
     - `src/content/blog/my-post/hero.jpg`
  2) In `index.mdx`:
     ```mdx
     ---
     title: My Post
     date: 2025-09-02
     heroImage: ./hero.jpg
     tags: [astro]
     ---

     import { Picture } from 'astro:assets';
     import ResponsiveImage from '../../components/ResponsiveImage.astro';
     import diagram from './diagram.png';

     Inline image via Picture:
     <Picture src={diagram} widths={[320,640,960,1280]} sizes="(min-width:768px) 768px, 100vw" formats={['avif','webp','png']} alt="Diagram" />

     Or via shared component:
     <ResponsiveImage src={diagram} alt="Diagram" sizes="(min-width:768px) 768px, 100vw" />
     ```

- __Create a new project__
  1) `src/content/projects/my-project/index.mdx`
  2) Frontmatter:
     ```md
     ---
     title: My Project
     description: Short summary
     date: 2025-09-02
     heroImage: ./hero.png
     github: https://github.com/you/repo
     demo: https://example.com
     ---
     ```

- __Hero images__
  - Store images next to the content file, reference with a relative path.
  - When schema `image()` resolves to `ImageMetadata`, the routes/layouts render with `ResponsiveImage.astro` (uses `Picture` under the hood). SVGs fall back to `<img>`.

- __Routing__
  - Blog pages: `src/pages/blog/[...slug].astro` (uses `getCollection('blog')` and `post.render()`).
  - Project pages: `src/pages/projects/[...slug].astro`.

- __Mermaid diagrams__
  - Markdown/MDX diagrams are rendered server-side via `rehype-mermaid` configured in `astro.config.mjs`.

## 🔧 Performance Tools

### Build Tools

```bash
# Optimize images
bun run scripts/optimize-images.js

# Build with optimizations
bun run build
```

### Performance Monitoring

- Integrated with Core Web Vitals
- Real User Monitoring (RUM)
- Performance budget tracking
- Third-party impact monitoring

### Debug Tools

```bash
# Check bundle sizes
bun run build -- --debug
```

## 📦 Caching & Headers

Implemented via Cloudflare Pages caching and hashed filenames:

- __Hashed assets__: `/assets/*` immutable for 1 year
- __Bundled JS__: `/chunks/*.js` and `/entry.*.js` immutable for 1 year
- __Fonts__: woff2 immutable for 1 year
- __HTML__: `max-age=0, must-revalidate`

How it works:
- Cloudflare Pages automatically handles caching for static assets
- Filenames include content hashes per `astro.config.mjs` rollup output settings
- Custom headers can be configured via `_headers` file or Cloudflare dashboard

## 🐛 Browser Console Error Prevention

The website is designed to prevent common browser console errors:

### Script Loading Optimization

- **Progressive Loading**: Scripts are loaded in priority tiers (high, medium, low) to optimize page performance
- **Proper Variable Scoping**: All script variables are properly defined in their execution context
- **Error Handling**: Script loading includes proper error handling to prevent reference errors
- **Cookie Consent Integration**: Third-party scripts are only loaded after obtaining user consent

### Font Loading Optimization

- **Correct Font Weight Syntax**: Using numeric weights (e.g., `700`) instead of descriptive weights (e.g., `bold`)
- **Font Loading Error Handling**: Graceful fallback to system fonts if web fonts fail to load
- **Font Loading State Management**: Proper tracking of font loading state in localStorage

### CSS Syntax Fixes

- **Proper CSS Property Syntax**: Ensuring all CSS properties include required semicolons
- **Valid CSS Values**: Using valid CSS values for all properties including aspect-ratio

### Cookie and Privacy Compliance

- **Cookie Consent Banner**: User-friendly banner for obtaining cookie consent
- **Privacy Policy Page**: Detailed privacy policy explaining data collection practices
- **SameSite Cookie Handling**: Proper handling of third-party cookies with SameSite attributes
- **Conditional Script Loading**: Third-party scripts only load when consent is given

## 🎨 Customization

### Adding New Social Media Links

1. Open `src/config/socials.ts`
2. Add a new entry to the `socials` array:
   ```typescript
   {
     platform: 'newplatform',
     url: 'https://newplatform.com/username',
     label: 'Platform Name'
   }
   ```

### Adding Custom Icons

1. Open `src/config/icons.ts`
2. Add your SVG path:
   ```typescript
   export const Icons = {
     NewIcon: `<path d="..." />`,
   };
   ```

### Using Icons

```astro
<Icons name="NewIcon" class="h-6 w-6" />
```

### Modifying Theme Colors

1. Open `tailwind.config.mjs`
2. Customize the theme section:
   ```javascript
   theme: {
     extend: {
       colors: {
         // Add your custom colors
       }
     }
   }
   ```

## 🧞 Available Commands

| Command                           | Action                                      |
| :-------------------------------- | :------------------------------------------ |
| `bun install`                     | Installs dependencies                       |
| `bun run dev`                     | Starts local dev server at `localhost:4321` |
| `bun run build`                   | Build your production site to `./dist/`     |
| `bun run preview`                 | Preview your build locally before deploying |
| `bun run scripts/optimize-images.js` | Optimize and convert images              |

## 🚀 Deployment

- Hosted on Cloudflare Pages. Build command: `bun run build`; publish directory: `dist/`.
- Cloudflare Pages automatically handles caching and CDN distribution.
- For local preview: `bun run preview`.

## 📊 Performance Metrics

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Additional Metrics

- **TTFB**: Optimized server response
- **FCP**: Fast first content paint
- **TTI**: Quick time to interactive

## 🔧 Technical Details

### Performance Optimizations

- **Images**:
  - WebP format with JPEG fallbacks
  - Responsive sizes (1x and 2x)
  - Proper width/height attributes
  - Lazy loading implementation
- **JavaScript**:
  - Minimal usage
  - Code splitting
  - Async loading where possible
  - Optimized theme switching
- **Icons**:
  - Inline SVGs instead of icon fonts
  - No external icon libraries
  - CSS-based styling
- **CSS**:
  - Purged unused styles
  - Minimal Tailwind imports
  - Efficient dark mode implementation
- **Caching**:
  - Proper cache headers for static assets
  - Local storage for user preferences

### Dependencies

- Core: `astro` (6.x beta), `@astrojs/tailwind`, `@astrojs/cloudflare`, `rehype-mermaid`, `date-fns`
- Dev: `@astrojs/mdx`, ESLint/Prettier toolchain, TailwindCSS
- Runtime: Bun (package manager and runtime)
- See `package.json` for exact versions.

### Performance Features

- **Astro 6 (beta)**: Static site generator with improved performance
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type safety
- **Bun**: Fast JavaScript runtime and package manager
- **Cloudflare Pages**: Edge deployment with global CDN

### Optimization Configuration

#### Config highlights (astro.config.mjs)

```js
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  prefetch: true,
  integrations: [tailwind(), mdx()],
  build: {
    assets: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'entry.[hash].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  markdown: {
    rehypePlugins: [require('rehype-mermaid')]
  }
});
```

#### Image Optimization

```javascript
// scripts/optimize-images.js
module.exports = {
  quality: 80,
  formats: ['webp', 'avif'],
  sizes: [640, 768, 1024, 1280],
};
```

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design works on all screen sizes
- Progressive enhancement approach
- Fallbacks for older browsers

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
