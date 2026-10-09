---
name: Grid + Notebook
description: Swiss structure with a notebook voice. A 12-column grid, hairline rules and mono labels carrying a calm serif (Newsreader) for headings and reading, with sidenotes in the article margin. Near-monochrome, one signal accent.
colors:
  dark-bg: "#0a0a0b"
  dark-surface: "#141416"
  dark-row-hover: "#19191c"
  dark-text: "#f3f3f1"
  dark-text-secondary: "#b6b6b9"
  dark-text-muted: "#8f8f94"
  dark-rule: "#2c2c30"
  dark-rule-strong: "#70707a"
  dark-accent: "#ff5a47"
  dark-accent-ink: "#0a0a0b"
  light-bg: "#f7f7f5"
  light-surface: "#ececea"
  light-row-hover: "#efefed"
  light-text: "#0a0a0b"
  light-text-secondary: "#404045"
  light-text-muted: "#66666b"
  light-rule: "#d4d4d0"
  light-rule-strong: "#8a8a8e"
  light-accent: "#c8200e"
  light-accent-ink: "#ffffff"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.9rem + 3.6vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.7rem + 2.4vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.625rem, 1.35rem + 1.2vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
  article:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.1875rem, 1.13rem + 0.25vw, 1.25rem)"
    lineHeight: 1.6
  meta:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  none: "0"
  code: "2px"
spacing:
  gutter: "1.5rem"
  band: "clamp(2.5rem, 5vw, 4.5rem)"
  max-width: "88rem"
components:
  button-primary:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.dark-text}"
    textColor: "{colors.dark-bg}"
    rounded: "{rounded.none}"
---

# Design System: Grid + Notebook

## 1. Overview

Swiss structure, notebook voice. A rational 12-column grid with hairline rules and mono labels carries a calm serif for headings and reading, with sidenotes in the article margin for the asides. The name is a headline, not a poster. The wit comes from layout and the occasional margin note (everything aligning on column 4, a red full stop after the name), never from ornament. There are no gradients, glows, shadows, blurs, or rounded corners.

## 2. Grid

- **12 columns** from 768px (`.grid-12`, 1.5rem gutter, max width 88rem); a single column below.
- **Labels in columns 1-3** (`.c-label`), **content starting on column 4** (`.c-body`), on every page. Index rows, the track record, article meta, and footers all obey this.
- **Bands** (`.band`) are separated by hairline rules. Section labels are mono, sentence case, numbered by CSS counter (`01 — Writing`, `.sec-num`). Never tracked uppercase eyebrows.

## 3. Colors

Near-monochrome, two themes, tokens in `src/styles/globals.css` (`@theme` for dark, `.light` overrides). Components use semantic tokens only (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-text-muted`, `--color-rule`, `--color-rule-strong`, `--color-accent`, `--color-accent-ink`).

- **Accent**: signal red-orange (dark `#ff5a47`, light `#c8200e`). Used for links in prose, focus rings, the active nav underline, the primary button, the reading progress rule, and one graphic moment (the full stop after the name).
- **Rule** is decorative hairline; **rule-strong** is for UI borders (controls, table heads) and clears 3:1 on the background.
- The primary button pairs the accent with `accent-ink` (near-black in dark, white in light).

### Named Rules
- **One accent, used sparingly.** If a second thing is red, remove one.
- **Rules, not boxes.** Separate with a 1px line, never a card, shadow, or fill. Row hover is the only fill.

## 4. Typography

- **Newsreader** (variable weight axis, Latin, normal + italic) for the name, all headings, leads, list titles, and article prose. Prose is 19-20px, line-height 1.6, a 65ch measure. Article `h3`s are italic. The weight-only file (58 KB) is used rather than the optical-size one (132 KB) to keep page weight down. Normal is preloaded everywhere; italic loads on demand.
- **Plus Jakarta Sans** (variable, one file) for UI only: navigation, buttons, text links, topics, sidenotes.
- **System monospace** (`ui-monospace, SFMono-Regular, Menlo, monospace`, no download) for dates, reading time, labels, section numbers, the TOC index, and code.
- Article `h2`s carry a hairline and a mono counter (`01`, `02`...) that matches the margin TOC.

## 5. Elevation

None. No shadows, glows, gradients, blur, or blend modes. Depth is hairlines and the occasional surface fill (code, row hover).

## 6. Components

- **Buttons**: rectangular, 0 radius, solid accent; hover inverts to text-on-background. Secondary actions are underlined text links (`.link`): hover moves underline offset and turns the accent.
- **Index list** (`PostIndex`): table-like rows with hairlines: mono ISO date | title | topics | reading time. Row hover is a fill; the whole row is the hit area. Used on `/blog`, `/projects`, tag pages, and the home "More writing".
- **Topics**: plain small comma-separated text (no chips, no hashtags).
- **Sidenotes**: `<aside class="sidenote">…</aside>` in markdown, placed before the paragraph it annotates. Floats into the right margin (14rem) from 80rem; below that, an inline small sans note with a hairline left rule.
- **Blockquotes / `.pull-quote`**: italic serif between hairlines, no side stripe or box.
- **Navigation**: solid bar, hairline bottom; wordmark in columns 1-3, links start on column 4, active link has a 2px accent underline. Controls are square 2.75rem outlined buttons.
- **Article**: header meta row (Published | Reading time | Topics) on the grid, large title from column 4, sticky numbered mono TOC in columns 1-3, prose capped at 65ch, sidenotes in the right margin from 80rem.
- **Motion**: color and underline changes only, no transforms, gated on `html.motion-ok` and neutralised under `prefers-reduced-motion`. No scroll reveals.

## 7. Do's and Don'ts

### Do
- Start content on column 4; put labels in 1-3.
- Use mono for every piece of metadata.
- Keep contrast at AA in both themes (see ratios in the PR notes).

### Don't
- No rounded corners beyond 2px, shadows, gradients, glows, or hero-metric/icon-card grids.
- No tracked uppercase eyebrows or `#hashtag` chips.
