---
status: complete
priority: p2
issue_id: "014"
tags: [code-review, documentation]
dependencies: []
---

# Update CLAUDE.md Documentation for Biome Tooling

## Problem Statement

The `CLAUDE.md` file still references the old ESLint and Prettier tooling that has been replaced by Biome in this PR. This will cause confusion for developers (and AI assistants) using this documentation.

## Findings

**Evidence from architecture-strategist and git-history-analyzer agents:**

Current documentation in CLAUDE.md:
```markdown
# Quality
bun run lint             # ESLint check (.js, .ts, .astro files)
bun run lint:fix         # Auto-fix lint issues
bun run format           # Prettier format all files
bun run format:check     # Check formatting without writing
```

Actual new commands after Biome migration:
```json
"lint": "biome check .",
"lint:fix": "biome check . --write",
"format": "biome format . --write",
"format:check": "biome format ."
```

**Impact:**
- Developer onboarding confusion
- Incorrect tool expectations
- AI assistants (like Claude) will give incorrect guidance

## Proposed Solutions

### Option A: Update CLAUDE.md comments to reflect Biome (Recommended)

Update the comments in the Quality section to accurately describe Biome commands.

**Pros:**
- Simple, targeted fix
- Maintains documentation accuracy

**Cons:**
- None

**Effort:** Small
**Risk:** Low

## Recommended Action

Option A - Update the CLAUDE.md documentation to reflect the new Biome tooling.

## Technical Details

**Affected files:**
- `CLAUDE.md`

**Proposed change:**
```markdown
# Quality
bun run lint             # Biome check (lint + format) all files
bun run lint:fix         # Auto-fix lint and format issues
bun run format           # Biome format all files
bun run format:check     # Check formatting without writing
```

## Acceptance Criteria

- [ ] CLAUDE.md references Biome, not ESLint/Prettier
- [ ] Command descriptions are accurate
- [ ] No references to removed tools remain in documentation

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-29 | Created finding from code review | - |

## Resources

- PR #6: https://github.com/ace139/ace139.github.io/pull/6
- architecture-strategist agent analysis
- git-history-analyzer agent analysis
