---
status: complete
priority: p1
issue_id: "013"
tags: [code-review, tooling, biome]
dependencies: []
---

# Biome Configuration Missing Ignore for Generated Directories

## Problem Statement

The current `biome.json` does not exclude generated directories, causing lint failures when running `bun run lint`. The `.astro/` directory contains generated TypeScript files that produce thousands of lint errors and warnings.

## Findings

**Evidence from architecture-strategist agent:**

Running `bun run lint` produces approximately 2,250 errors and 2,210 warnings, primarily from:
- `.astro/astro/content.d.ts` (generated Astro types)
- Other generated files in `.astro/` directory

The `.astro/` directory is in `.gitignore` but Biome appears to be scanning it anyway. While Ultracite's core preset includes VCS integration (`useIgnoreFile: true`), this is not effectively excluding the generated directory.

**Current biome.json:**
```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.13/schema.json",
  "extends": ["ultracite/biome/astro"],
  "css": {
    "parser": {
      "cssModules": true
    }
  }
}
```

## Proposed Solutions

### Option A: Add explicit file ignores to biome.json (Recommended)

Add a `files.ignore` section to explicitly exclude generated directories.

```json
{
  "files": {
    "ignore": [".astro/**", "dist/**", "node_modules/**"]
  }
}
```

**Pros:**
- Clear and explicit
- Works regardless of VCS ignore configuration
- Easy to understand and maintain

**Cons:**
- Slight duplication with .gitignore

**Effort:** Small
**Risk:** Low

### Option B: Create a .biomeignore file

Create a separate `.biomeignore` file listing directories to exclude.

**Pros:**
- Separates ignore configuration from main config
- Follows pattern of other tools (.gitignore, .prettierignore)

**Cons:**
- Additional file to maintain
- Biome prefers inline configuration

**Effort:** Small
**Risk:** Low

## Recommended Action

Option A - Add explicit file ignores to biome.json. This is the most straightforward solution and Biome's recommended approach.

## Technical Details

**Affected files:**
- `biome.json`

**Proposed change:**
```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.13/schema.json",
  "extends": ["ultracite/biome/astro"],
  "files": {
    "ignore": [".astro/**", "dist/**"]
  },
  "css": {
    "parser": {
      "cssModules": true
    }
  }
}
```

## Acceptance Criteria

- [ ] `bun run lint` completes without scanning generated directories
- [ ] No errors from `.astro/` directory files
- [ ] Lint still runs on actual source files
- [ ] `dist/` directory is also excluded

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-29 | Created finding from code review | - |

## Resources

- PR #6: https://github.com/ace139/ace139.github.io/pull/6
- architecture-strategist agent analysis
- Biome documentation: https://biomejs.dev/reference/configuration/#filesignore
