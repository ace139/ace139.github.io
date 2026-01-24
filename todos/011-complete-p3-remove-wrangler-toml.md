---
status: complete
priority: p3
issue_id: "011"
tags: [code-review, cleanup, simplification]
dependencies: []
---

# Consider Removing wrangler.toml

## Problem Statement

The `wrangler.toml` file uses `[site]` block which is for Workers Sites, not Cloudflare Pages. For Pages, the deploy command already specifies everything needed.

## Findings

### Code Simplicity Reviewer:
```toml
name = "soumyo-com"
compatibility_date = "2025-01-01"

[site]
bucket = "./dist"
```

The deploy command already specifies the directory:
```bash
wrangler pages deploy dist --project-name=soumyo-com
```

### Impact:
- File may be unnecessary
- `[site]` block is for Workers Sites, not Pages
- Could cause confusion

## Proposed Solutions

### Solution 1: Remove wrangler.toml
The file is not needed for Cloudflare Pages when using `wrangler pages deploy` with explicit arguments.

**Pros:**
- Removes unnecessary file
- Avoids confusion between Workers Sites and Pages
- Cleaner project structure

**Cons:**
- Lose potential for future wrangler config

**Effort:** Small
**Risk:** None

### Solution 2: Keep but clarify
Add comment explaining the file's purpose or update for Pages-specific config if any exists.

**Effort:** Small
**Risk:** None

## Recommended Action

<!-- To be filled during triage -->

## Technical Details

**Affected Files:**
- `wrangler.toml` (delete or modify)

**Acceptance Criteria:**
- [ ] Deployment still works without wrangler.toml
- [ ] Or file updated with accurate configuration

## Work Log

| Date | Action | Result/Learning |
|------|--------|-----------------|
| 2025-01-23 | Simplicity review questioned necessity | wrangler.toml may not be needed for Pages |

## Resources

- Cloudflare Pages deploy: https://developers.cloudflare.com/pages/platform/direct-upload/
