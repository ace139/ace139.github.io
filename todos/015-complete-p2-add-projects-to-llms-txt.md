---
status: complete
priority: p2
issue_id: "015"
tags: [code-review, agent-native]
dependencies: ["012"]
---

# Add Projects Section to llms.txt

## Problem Statement

Human users can browse projects at `/projects`, but AI agents have no visibility into this content via llms.txt. This breaks action parity between users and agents - a core principle of agent-native architecture.

## Findings

**Evidence from agent-native-reviewer agent:**

The llms.txt file only includes blog posts, not projects:

```javascript
// generate-llms-txt.js only has getBlogPosts()
// No getProjects() function exists
```

**Capability Map:**

| UI Action | Location | Agent Access | Status |
|-----------|----------|--------------|--------|
| View projects listing | `/src/pages/projects.astro` | Not in llms.txt | Missing |
| View project post | `/src/pages/projects/[...slug].astro` | Not in llms.txt | Missing |

**Impact:**
- AI agents cannot discover or understand the site's project content
- Users and agents have different visibility into the site

## Proposed Solutions

### Option A: Add getProjects() function to generate-llms-txt.js (Recommended)

Mirror the `getBlogPosts()` function for projects, with proper draft filtering.

**Pros:**
- Consistent with existing pattern
- Achieves parity with blog posts
- Includes draft filtering from the start

**Cons:**
- Additional code to maintain

**Effort:** Small
**Risk:** Low

## Recommended Action

Option A - Add a projects section to llms.txt that mirrors the blog posts section.

## Technical Details

**Affected files:**
- `scripts/generate-llms-txt.js`

**Changes needed:**
1. Add `getProjects()` function similar to `getBlogPosts()` but reading from `src/content/projects`
2. Add a "## Projects" section to the llms.txt output
3. Ensure draft filtering is applied (fixes dependency on issue 012)

**Proposed addition:**
```javascript
function getProjects() {
    const projectsDir = path.join(__dirname, "../src/content/projects");
    const projects = [];
    // Similar logic to getBlogPosts()
    // Include draft filtering!
    return projects;
}
```

## Acceptance Criteria

- [ ] llms.txt includes a "## Projects" section
- [ ] All non-draft projects are listed with title and description
- [ ] Draft projects are excluded
- [ ] Projects link to correct URLs (`/projects/[slug]`)

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-29 | Created finding from code review | - |

## Resources

- PR #6: https://github.com/ace139/ace139.github.io/pull/6
- agent-native-reviewer agent analysis
