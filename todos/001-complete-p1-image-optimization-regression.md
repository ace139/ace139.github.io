---
status: pending
priority: p1
issue_id: "001"
tags: [code-review, performance, regression]
dependencies: []
---

# Image Optimization Regression - WebP/AVIF Lost, File Sizes 5-6x Larger

## Problem Statement

The migration from `sharp` to `jimp` has caused a severe regression in image optimization:

1. **WebP output removed** - Only JPEG is now generated
2. **File sizes increased dramatically**:
   - `profile-256.jpg`: 11KB (WebP) → 78KB (JPEG) = **574% larger**
   - `profile-128.jpg`: 4KB (WebP) → 27KB (JPEG) = **557% larger**
3. **Broken preload references** - `Layout.astro` still references `.webp` files that won't be regenerated

## Findings

### Performance Oracle Agent:
- Image payload increased 5-6x, directly impacting Core Web Vitals (LCP)
- Mobile users on slow connections will experience significantly more data transfer
- The `ResponsiveImage.astro` component expects WebP/AVIF formats

### Architecture Strategist Agent:
- Feature regression: jimp cannot produce WebP or AVIF
- No explicit quality setting in jimp implementation
- Missing mozjpeg encoder (sharp used `mozjpeg: true` for 5-10% smaller files)

### Code Simplicity Reviewer:
- Over-simplified: Lost critical WebP functionality
- Layout.astro references `.webp` files that won't exist after clean CI build

### Evidence:
```javascript
// OLD (sharp) - /scripts/optimize-images.js
await sharp(inputPath)
  .webp({ quality: 80 })
  .toFile(`profile-${size}.webp`);
await sharp(inputPath)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(`profile-${size}.jpg`);

// NEW (jimp) - Only JPEG, no quality setting
const image = await Jimp.read(inputPath);
const resized = image.cover({ w: size, h: size });
await resized.write(`profile-${size}.jpg`);
```

## Proposed Solutions

### Solution 1: Revert to sharp (Recommended)
**Pros:**
- Full WebP/AVIF support
- Superior compression (mozjpeg, libvips)
- Matches existing codebase expectations
- Native performance

**Cons:**
- Native dependency (may have Bun compatibility concerns)
- Larger node_modules

**Effort:** Small
**Risk:** Low

### Solution 2: Update all references to JPEG-only
**Pros:**
- No dependency changes needed
- Jimp works with Bun

**Cons:**
- Permanent 5-6x image size regression
- Degrades Core Web Vitals
- Goes against modern web best practices

**Effort:** Medium (update Layout.astro, _headers, etc.)
**Risk:** Medium (performance degradation)

### Solution 3: Use Astro's built-in image optimization only
**Pros:**
- Already used for avatar in index.astro
- Handles AVIF/WebP automatically

**Cons:**
- Would need to restructure how profile images are handled
- Preload strategy would need rethinking

**Effort:** Medium
**Risk:** Low

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**Affected Files:**
- `scripts/optimize-images.js` - Image generation
- `src/layouts/Layout.astro:100-103` - WebP preload references
- `scripts/generate-headers.js:34-37` - WebP cache headers
- `public/images/profile-*.webp` - Stale files from previous build

**Acceptance Criteria:**
- [ ] Profile images generated in WebP format (and optionally AVIF)
- [ ] JPEG fallback for older browsers
- [ ] File sizes comparable to previous sharp implementation
- [ ] Preload references match generated files
- [ ] Cache headers match generated files
- [ ] Build succeeds with `bun run build`

## Work Log

| Date | Action | Result/Learning |
|------|--------|-----------------|
| 2025-01-23 | Code review identified regression | Image sizes 5-6x larger, WebP references broken |

## Resources

- PR/Branch: uncommitted changes on main
- Related: Astro image optimization docs
- Similar: https://docs.astro.build/en/guides/images/
