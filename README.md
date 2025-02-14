# Personal Portfolio Website

A modern, responsive personal portfolio website built with Astro 5, TailwindCSS, and TypeScript. Features dark mode support, dynamic social media links, and a clean, minimalist design with optimized performance.

## 🌟 Features

- 🎨 **Responsive Design**: Mobile-first approach with a clean, modern interface
- 🌓 **Dark/Light Mode**: System-preference detection with manual toggle option
- 🔗 **Dynamic Social Links**: Centralized configuration for easy management
- ⚡ **Performance Optimized**: 
  - Optimized image loading with WebP support
  - Inline SVG icons for faster loading
  - Minimal JavaScript footprint
  - Code splitting and lazy loading
- 🎯 **Accessibility**: Screen reader support and semantic HTML
- 🛠 **Type Safety**: TypeScript integration for better development experience

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
│   │   └── [optimized images]
│   └── scripts/
│       └── theme.js
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── resume.astro
│   ├── components/
│   │   ├── Icons.astro
│   │   └── SocialIcons.astro
│   ├── config/
│   │   ├── socials.ts
│   │   └── icons.ts
│   └── scripts/
│       └── theme.js
├── scripts/
│   └── optimize-images.js
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
   npm install
   ```

3. **Configure social media links**
   Edit `src/config/socials.ts`:
   ```typescript
   export const socials: Social[] = [
     {
       platform: 'github',
       url: 'https://github.com/yourusername',
       label: 'GitHub'
     },
     // Add more social links...
   ];
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠 Core Components

### Layout (Layout.astro)
- Base template for all pages
- Implements navigation and theme toggle
- Handles dark mode functionality with optimized JavaScript
- Responsive design implementation

### Homepage (index.astro)
- Main landing page with optimized image loading
- Profile section with WebP image support
- Dynamic social media links with SVG icons
- Responsive layout adjustments

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
- Sharp-powered image processing
- Automated optimization script

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
<Icons name="NewIcon" class="w-6 h-6" />
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

| Command                   | Action                                           |
| :----------------------- | :----------------------------------------------- |
| `npm install`            | Installs dependencies                            |
| `npm run dev`            | Starts local dev server at `localhost:4321`      |
| `npm run build`          | Build your production site to `./dist/`          |
| `npm run preview`        | Preview your build locally before deploying      |
| `node scripts/optimize-images.js` | Optimize and convert images             |

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
- **Astro**: Static site generator
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type safety
- **Sharp**: Image optimization

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
