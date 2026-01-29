---
status: complete
priority: p1
issue_id: "012"
tags: [code-review, security, agent-native]
dependencies: []
---

# Draft Content Exposed in llms.txt

## Problem Statement

The `generate-llms-txt.js` build script does NOT filter out draft posts when generating the `llms.txt` file. While all Astro pages properly filter draft content using `getCollection('blog', ({ data }) => data.draft !== true)`, the build script reads markdown files directly from disk without checking the `draft` frontmatter field.

This creates a **context disparity** where AI agents accessing the site via llms.txt can see draft (unpublished) content that human users cannot see on the website.

## Findings

**Evidence from security-sentinel agent:**

Location: `/Users/soumyo/Projects/ace139.github.io/scripts/generate-llms-txt.js` (lines 13-48)

```javascript
const files = fs.readdirSync(blogDir);
for (const file of files) {
    // Only process .md and .mdx files
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) {
        continue;
    }
    // ... NO draft field check ...
}
```

Compare to the UI which correctly filters:
```javascript
// Line 9 in blog.astro
const posts = await getCollection('blog', ({ data }) => data.draft !== true);
```

**Impact:**
- Draft blog posts will be listed in `public/llms.txt`, potentially exposing unpublished content
- LLM crawlers and aggregators indexing `llms.txt` will see draft content URLs
- This undermines the purpose of the new `draft` field in the content schema

## Proposed Solutions

### Option A: Add draft filtering to getBlogPosts() (Recommended)

Parse the `draft` frontmatter field and filter out posts where `draft: true`.

**Pros:**
- Minimal change to existing code
- Maintains current architecture

**Cons:**
- Still bypasses Astro's content layer validation

**Effort:** Small
**Risk:** Low

### Option B: Refactor to use Astro's content layer

Import and use Astro's content collections in the script to ensure parity with how the UI accesses content.

**Pros:**
- Ensures schema validation is applied
- Single source of truth for content access

**Cons:**
- May require significant refactoring
- Build script running in Node.js context may have limitations accessing Astro APIs

**Effort:** Medium
**Risk:** Medium

## Recommended Action

Option A - Add draft filtering to the existing script by parsing the `draft` frontmatter field.

## Technical Details

**Affected files:**
- `scripts/generate-llms-txt.js`

**Changes needed:**
In the `getBlogPosts()` function, after parsing frontmatter, add:
```javascript
const draftMatch = frontmatter.match(/draft:\s*(true|false)/);
const isDraft = draftMatch && draftMatch[1] === 'true';
if (isDraft) {
    continue; // Skip draft posts
}
```

## Acceptance Criteria

- [ ] `generate-llms-txt.js` parses the `draft` frontmatter field
- [ ] Posts with `draft: true` are excluded from llms.txt output
- [ ] Manual test: Create a draft post, run build, verify it's not in llms.txt
- [ ] Existing non-draft posts still appear in llms.txt

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-29 | Created finding from code review | - |

## Resources

- PR #6: https://github.com/ace139/ace139.github.io/pull/6
- security-sentinel agent analysis
- agent-native-reviewer agent analysis
