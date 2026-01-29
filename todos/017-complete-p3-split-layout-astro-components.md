---
status: complete
priority: p3
issue_id: "017"
tags: [code-review, architecture, refactoring]
dependencies: []
---

# Split Layout.astro into Smaller Components

## Problem Statement

`Layout.astro` is a 623-line monolithic file handling multiple concerns:
- Meta/SEO (head content)
- Navigation (desktop and mobile)
- Layout shell (main content wrapper)
- Footer
- Four separate script blocks
- 71 lines of global light mode CSS overrides

This makes the file difficult to maintain, test, and reason about.

## Findings

**Evidence from code-simplicity-reviewer agent:**

The file handles too many concerns:
1. **Meta/SEO** (lines 46-130): `<head>` content, theme script
2. **Navigation** (lines 158-294): Nav bar + mobile menu
3. **Layout shell** (lines 296-385): Main content wrapper + footer
4. **Scripts** (lines 388-547): 4 separate `<script>` blocks
5. **Global styles** (lines 551-622): Light mode CSS overrides

**Additional issues identified:**
- Social icons in footer (lines 341-374) are hardcoded SVGs but also exist in `SocialIcons.astro` component
- Four separate script blocks could be consolidated

**Estimated LOC reduction: 150-200 lines** through componentization.

## Proposed Solutions

### Option A: Extract Navigation and Footer components (Recommended)

Create `Navigation.astro` and `Footer.astro` components.

**Pros:**
- Significant reduction in Layout.astro complexity
- Components are reusable
- Easier to maintain each concern independently
- Footer can use existing `SocialIcons.astro` component

**Cons:**
- More files in components directory
- Potential prop drilling for shared state

**Effort:** Medium
**Risk:** Low

### Option B: Extract only Navigation

Keep footer inline but extract navigation (the larger component).

**Pros:**
- Smaller change
- Addresses the largest component

**Cons:**
- Footer duplication remains
- Partial fix

**Effort:** Small
**Risk:** Low

### Option C: Leave as-is

Accept current structure as a single-file layout pattern.

**Pros:**
- No changes needed
- Everything in one place

**Cons:**
- Continued maintenance burden
- 623 lines is large for a single component

**Effort:** None
**Risk:** None

## Recommended Action

Option A - Extract both Navigation and Footer. This reduces Layout.astro by approximately 200 lines and improves maintainability.

## Technical Details

**New files:**
- `src/components/Navigation.astro`
- `src/components/Footer.astro`

**Files to update:**
- `src/layouts/Layout.astro`

**Components to reuse:**
- `SocialIcons.astro` in Footer

## Acceptance Criteria

- [ ] `Navigation.astro` extracts lines 158-294
- [ ] `Footer.astro` extracts lines 304-385
- [ ] Footer uses `SocialIcons.astro` instead of inline SVGs
- [ ] Layout.astro imports and uses new components
- [ ] Visual appearance unchanged
- [ ] Theme toggle and mobile menu still work

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-29 | Created finding from code review | - |

## Resources

- PR #6: https://github.com/ace139/ace139.github.io/pull/6
- code-simplicity-reviewer agent analysis
