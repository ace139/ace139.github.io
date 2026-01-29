---
status: complete
priority: p3
issue_id: "016"
tags: [code-review, code-quality, refactoring]
dependencies: []
---

# Extract Draft Filter to Shared Utility

## Problem Statement

The same draft filter lambda is repeated across 7 locations in the codebase:

```typescript
({ data }) => data.draft !== true
```

This violates DRY (Don't Repeat Yourself) principle and makes future changes to filtering logic harder to maintain.

## Findings

**Evidence from pattern-recognition-specialist agent:**

The filter appears in:
- `/src/pages/blog.astro` (line 9)
- `/src/pages/projects.astro` (line 10)
- `/src/pages/index.astro` (lines 11, 17)
- `/src/pages/tags/[tag].astro` (lines 10-11)
- `/src/pages/blog/[...slug].astro` (line 9)
- `/src/pages/projects/[...slug].astro` (line 9)

Additionally, the same date sorting comparator is repeated in 3 locations:
```typescript
.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
```

## Proposed Solutions

### Option A: Create content utilities file (Recommended)

Create `src/utils/content.ts` with reusable functions.

```typescript
// src/utils/content.ts
export const isPublished = ({ data }) => data.draft !== true;
export const sortByDateDesc = (a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
```

**Pros:**
- Single source of truth
- Easier to modify filtering logic
- Better testability
- Clear naming communicates intent

**Cons:**
- Additional import needed in each file
- Minor overhead for simple functions

**Effort:** Small
**Risk:** Low

### Option B: Leave as-is

Accept the duplication as acceptable for simple expressions.

**Pros:**
- No changes needed
- Each file is self-contained

**Cons:**
- Continued duplication
- Harder to modify across all locations

**Effort:** None
**Risk:** None

## Recommended Action

Option A - Extract to shared utilities. While the functions are simple, having a single source of truth makes the codebase more maintainable.

## Technical Details

**New file:**
- `src/utils/content.ts`

**Files to update:**
- All 6 pages listed above

## Acceptance Criteria

- [ ] `src/utils/content.ts` exists with `isPublished` and `sortByDateDesc` functions
- [ ] All pages import and use the shared functions
- [ ] Functionality unchanged (all tests pass)
- [ ] No duplicate filter/sort logic remains

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-29 | Created finding from code review | - |

## Resources

- PR #6: https://github.com/ace139/ace139.github.io/pull/6
- pattern-recognition-specialist agent analysis
