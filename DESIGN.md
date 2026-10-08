---
name: The Engineer's Notebook
description: A warm, dark-first reading system. One serif for display and prose, one sans for UI, hairline rules instead of boxes, and a margin column for dates, contents and sidenotes.
colors:
  bg: "#131211"
  bg-elevated: "#1b1917"
  surface: "#232120"
  border: "#38332f"
  border-strong: "#5a544d"
  text: "#ede9e2"
  text-secondary: "#c0b9ae"
  text-muted: "#9a9388"
  accent: "#ee6a4c"
  accent-hover: "#ff8a70"
  light-bg: "#f3f2ef"
  light-bg-elevated: "#faf9f7"
  light-surface: "#e9e7e3"
  light-border: "#d3cfc8"
  light-border-strong: "#a8a39b"
  light-text: "#1b1917"
  light-text-secondary: "#46423d"
  light-text-muted: "#625d56"
  light-accent: "#b4381b"
  light-accent-hover: "#8f2a12"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(3.25rem, 2rem + 5.5vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  h1:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.75rem + 2.2vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  h2:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.55rem + 0.9vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.15
  h3:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.3125rem, 1.25rem + 0.3vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.2
  lead:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.45vw, 1.4375rem)"
    lineHeight: 1.5
  prose:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.1875rem, 1.13rem + 0.25vw, 1.25rem)"
    lineHeight: 1.6
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.0625rem"
    lineHeight: 1.6
  ui:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
  note:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    lineHeight: 1.5
rounded:
  none: "0"
  sm: "3px"
  md: "4px"
spacing:
  label-column: "11rem"
  label-gap: "3rem"
  margin-column: "14rem"
  section: "clamp(2.5rem, 6vw, 4.5rem)"
components:
  button:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.25rem"
---

# Design System: The Engineer's Notebook

## 1. Overview

A notebook typeset properly. The site reads like a well-set technical essay: Newsreader (a text serif with an optical-size axis) carries every heading and all long-form reading; Plus Jakarta Sans handles only UI and marginalia. Nothing is boxed. Structure comes from hairline rules, whitespace and one repeated grid. The accent is a single deep vermilion that appears only on links, focus and current state, so when it shows up it means something.

Dark is the default (a warm near-black, never blue-black). Light is a warm off-white grey, deliberately not cream or paper (PRODUCT.md forbids a paper body background).

## 2. Colors

All colors are tokens in `src/styles/globals.css` (`@theme` for dark, `.light` for light). Components use only the semantic names.

| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#131211` | `#f3f2ef` | Page |
| `bg-elevated` | `#1b1917` | `#faf9f7` | Code blocks |
| `surface` | `#232120` | `#e9e7e3` | Inline code, image placeholders |
| `border` | `#38332f` | `#d3cfc8` | Hairline rules |
| `border-strong` | `#5a544d` | `#a8a39b` | Marginalia tick, sidenote rule, link underlines |
| `text` | `#ede9e2` | `#1b1917` | Headings, solid button |
| `text-secondary` | `#c0b9ae` | `#46423d` | Prose body, leads |
| `text-muted` | `#9a9388` | `#625d56` | Marginalia, meta |
| `accent` | `#ee6a4c` | `#b4381b` | Links, focus ring, current nav/TOC item |

Contrast (WCAG): every text pair clears 4.5:1 in both themes (see the report in the branch notes). Hairlines are decorative and are not required to reach 3:1.

### Rules
- **One accent, one job.** Vermilion marks links, `:focus-visible`, `aria-current` and the active TOC entry. It is never a fill, a gradient or a glow.
- **No amber, no ambient light, no gradients.** Surfaces are flat.
- **Warm neutrals only.** Every gray leans brown.

## 3. Typography

Two families, both self-hosted through Astro's Fonts API (`astro.config.mjs`).

- **Newsreader** (variable, optical-size axis on the upright face): display, headings, leads, dek, article prose, blockquotes.
- **Plus Jakarta Sans**: nav, buttons, marginalia, tables, topic links.

Modular scale (~1.25, fluid at the top): note 13 / ui 15 / body 17 / prose 19-20 / lead 20-23 / h3 21-24 / h2 28-36 / h1 36-56 / display 52-96 px. Headings are always the serif display style; section headings do not switch family.

Article prose is 19-20px, line-height 1.6, `max-width: 65ch`, `text-wrap: pretty`.

## 4. Layout: the two-column backbone

Everything hangs on one grid: a narrow **label column** (8.5rem at tablet, 11rem on desktop) and a **reading column**. Utilities in `globals.css`:

- `.shell`: page container, 72rem max.
- `.row`: the two-column grid (stacks below 48rem). `.ruled` adds a top hairline.
- `.row-body` / `.page-head-body`: content that starts in the reading column when a row has no label.
- `.marginalia`: the signature detail. A small sans note, muted, preceded by a short 1.5rem rule (the row's own hairline plays that role inside `.ruled` rows). Used for dates, reading time, section descriptions, the table of contents and sidenotes.

The nav follows the same grid: name in the label column, links starting at the reading column. Homepage sections, the writing index, the footer and the article header all use it.

## 5. Components

- **Button.** One solid style: ink fill (`text` on `bg`), 4px radius, no shadow, no lift. Secondary actions are underlined text links (`.link-quiet`).
- **Links.** Accent colored, thin underline. Quiet variant uses secondary text with a strong-border underline that turns accent on hover.
- **Entry list (`PostList.astro`).** Replaces cards and bento. Each row: date and reading time in the label column; serif title, one-line dek and plain topic links in the reading column. Used on the homepage, `/blog`, `/projects` and tag pages.
- **Topics (`Tags.astro`).** Plain small sans text links, no `#`, no chips.
- **Blockquote / pull quote.** Italic serif at h3 size, hairline above and below. No side stripe, no box.
- **Code.** 4px radius, hairline border, `bg-elevated`.

### Margin column and sidenotes

On articles the label column holds the date, reading time, topics and (below the header) a sticky table of contents. A **right margin column** (14rem, at viewport >= 80rem) hosts sidenotes. Write one in markdown as raw HTML, placed just before the paragraph it annotates:

```html
<aside class="sidenote">A short remark, set in the margin.</aside>
```

`.sidenote` (also usable on a `<span>` or `<div>`) floats into the right margin level with the following paragraph; below 80rem it drops into the text as a small note with a thin left rule. Keep notes to a sentence or two. The same class works inside `.prose` anywhere (articles, project write-ups, the About page).

## 6. Motion

Hover and focus transitions only (150ms). No scroll reveals, no load-in animation. The `html.motion-ok` gate is still set pre-paint for any future motion; `prefers-reduced-motion` zeroes transitions and disables smooth scroll. The reading-progress bar mirrors scroll position and is a thin ink line.

## 7. Do's and Don'ts

### Do
- Use hairlines and whitespace to separate; hang content on the label/reading grid.
- Set every heading in Newsreader.
- Keep the accent to links, focus and current state.
- Keep radii at 4px or less.

### Don't
- No cards, bento grids, overlay images, pills or `#hashtag` chips.
- No glow shadows, gradients, `backdrop-filter`, blur or ambient background light.
- No uppercase tracked eyebrow on every section; no cream/paper background.
- No second accent color.
