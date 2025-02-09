---
title: "Food Blog Platform"
description: "A modern food blog platform built with Next.js and Sanity.io"
date: "2025-01-15"
heroImage: "/images/food-blog.jpg"
tags: ["Next.js", "Sanity.io", "TailwindCSS"]
github: "https://github.com/johndoe/food-blog"
demo: "https://food-blog.demo.com"
layout: "../../layouts/ProjectPost.astro"
---

# Food Blog Platform

A modern, performant food blog platform that makes it easy for food enthusiasts to share their culinary adventures.

## Features

- **Real-time Preview**: See your content changes instantly
- **Image Optimization**: Automatic image optimization and responsive images
- **SEO Friendly**: Built-in SEO components and optimizations
- **Dark Mode**: Automatic and manual dark mode support
- **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **CMS**: Sanity.io
- **Styling**: TailwindCSS
- **Deployment**: Vercel
- **Analytics**: Plausible Analytics

## Implementation Details

### Image Handling

```javascript
const ImageComponent = ({ image, alt }) => {
  return (
    <Image
      src={urlForImage(image)}
      alt={alt}
      width={800}
      height={500}
      className="rounded-lg"
    />
  );
};
```

### Content Structure

The content is structured using Sanity.io schemas:

```javascript
export default {
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
    },
    // ... more fields
  ],
}
```

## Performance Metrics

- **Lighthouse Score**: 98/100
- **Core Web Vitals**: All metrics in the green
- **Time to First Byte**: < 200ms

## Future Improvements

1. Add recipe rating system
2. Implement comment functionality
3. Add social sharing features
4. Create mobile app version
