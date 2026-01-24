---
status: complete
priority: p1
issue_id: "003"
tags: [code-review, security, deployment]
dependencies: []
---

# Security Headers Lost in Migration from Netlify

## Problem Statement

The deleted `netlify.toml` contained important security headers that are NOT present in the new `wrangler.toml` or `_headers` file:
- `X-Content-Type-Options: nosniff` - MIME type sniffing protection
- `X-Frame-Options: DENY` - Clickjacking protection
- `X-XSS-Protection: 1; mode=block` - XSS filter (legacy but still useful)

## Findings

### Security Sentinel Agent:
- Lost security headers from `netlify.toml`:
  ```toml
  [[headers]]
    for = "/*"
    [headers.values]
      X-Content-Type-Options = "nosniff"
      X-Frame-Options = "DENY"
      X-XSS-Protection = "1; mode=block"
  ```
- Current `wrangler.toml` only has project name and bucket config
- `generate-headers.js` only generates cache headers, not security headers

### Impact:
- Site vulnerable to clickjacking attacks
- MIME type sniffing could be exploited
- Missing modern security headers like CSP, Referrer-Policy

## Proposed Solutions

### Solution 1: Add security headers to _headers file (Recommended)
Update `scripts/generate-headers.js` to include security headers:

```javascript
const securityHeaders = `
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
`;
```

**Pros:**
- Works with Cloudflare Pages
- Easy to maintain
- Can be version controlled

**Cons:**
- Script modification required

**Effort:** Small
**Risk:** None

### Solution 2: Configure in Cloudflare Dashboard
**Pros:**
- No code changes
- Cloudflare's Transform Rules are powerful

**Cons:**
- Not version controlled
- Requires manual dashboard configuration

**Effort:** Small
**Risk:** Low (configuration drift)

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**Affected Files:**
- `scripts/generate-headers.js` - Add security headers
- `dist/_headers` - Generated output

**Acceptance Criteria:**
- [ ] Security headers present in deployed site
- [ ] Headers verified with `curl -I https://soumyo.com`
- [ ] No clickjacking possible (X-Frame-Options)
- [ ] MIME sniffing blocked (X-Content-Type-Options)

## Work Log

| Date | Action | Result/Learning |
|------|--------|-----------------|
| 2025-01-23 | Security review identified missing headers | netlify.toml security headers not migrated |

## Resources

- Cloudflare Pages _headers: https://developers.cloudflare.com/pages/platform/headers/
- OWASP Security Headers: https://owasp.org/www-project-secure-headers/
