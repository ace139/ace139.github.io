---
name: The Quarterly
description: A long-form book system: one serif superfamily, ink on near-white by day, warm off-black by night, one oxblood accent.
colors:
  light-bg: "#fbfbfa"
  light-surface: "#f1f1ef"
  light-text: "#18181b"
  light-text-secondary: "#434349"
  light-text-muted: "#5b5b63"
  light-border: "#dededa"
  light-border-strong: "#8e8e88"
  light-primary: "#8c1c2b"
  light-primary-hover: "#640f1c"
  dark-bg: "#1c1b1a"
  dark-surface: "#262422"
  dark-text: "#ebe9e5"
  dark-text-secondary: "#c9c6c0"
  dark-text-muted: "#a3a09a"
  dark-border: "#3a3836"
  dark-border-strong: "#6a6761"
  dark-primary: "#e8838d"
  dark-primary-hover: "#f5aab1"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.6rem + 5vw, 5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.125rem, 1.45rem + 3vw, 3.5rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  dek:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.4375rem)"
    fontStyle: italic
    lineHeight: 1.45
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1rem"
    fontFeature: "smcp, c2sc"
    letterSpacing: "0.06em"
rounded:
  none: "0"
  portrait: "9999px"
spacing:
  measure: "66ch"
  page: "46rem"
  section: "clamp(2.5rem, 6vw, 4rem)"
components:
  button-primary:
    backgroundColor: "{colors.light-text}"
    textColor: "{colors.light-bg}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1.25rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.light-text}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1.25rem"
---

# Design System: The Quarterly

## 1. Overview

**Creative North Star: "A well-made book."** The site is set like a literary quarterly: a single centered text block of about 66 characters, generous margins, chapter-like openings, and typographic ornament in place of chrome. Reading is the product; everything else gets out of the way.

It is deliberately not the cream-paper editorial default PRODUCT.md forbids. The light ground is a neutral near-white (`#fbfbfa`) and the dark ground a warm dark grey (`#1c1b1a`), never blue-black and never beige. Light is the primary experience; dark is an equal "night reading" mode. With no stored choice the theme follows the reader's system preference.

Quiet humor lives in small typographic touches: a `* * *` section break, dot leaders in the contents lists, small-caps topics, a drop cap, and a colophon that names the typeface.

## 2. Colors

Defined once as semantic tokens with `light-dark()` in `src/styles/globals.css`; `html.light` / `html.dark` (from `localStorage.theme`) pin the scheme, otherwise `prefers-color-scheme` decides.

- **Ink** (`#18181b` / `#ebe9e5`): body and headings. Body text is full ink, not grey.
- **Secondary** (`#434349` / `#c9c6c0`): deks, descriptions.
- **Muted** (`#5b5b63` / `#a3a09a`): meta, topics, ornaments. Still AA for text.
- **Oxblood** (`#8c1c2b` day, a lifted carmine `#e8838d` night): the single accent. Links, focus rings, current-page and current-section states only.
- **Hairline / Strong** (`#dededa`/`#8e8e88`, `#3a3836`/`#6a6761`): decorative rules and the dotted leaders.

Contrast (WCAG): every text token is at least 5.9:1 on both background and surface in both themes; primary is 8.8:1 (light) and 6.6:1 (dark); the inverse button pair is 17.1:1 / 14.2:1.

**The One Voice Rule.** Oxblood never decorates. No gradients, glows, shadows, rounded cards or accent fills.

## 3. Typography

**One family: Source Serif 4** (roman and italic, variable weight and optical size). Optical sizing is automatic, so display sizes get fine, high-contrast forms and small sizes sturdier ones. The files in `src/assets/fonts/` are the Adobe release, subset to Latin with OpenType features kept, so small caps (`smcp`, `c2sc`) and old-style figures (`onum`) are the font's own, never synthesized (`font-synthesis: none`).

**UI is serif too.** Navigation, labels and meta are small caps and italics rather than a second sans family: it keeps the book voice, and the page loads two font files instead of three or four. Code is the only exception (system monospace).

- Running text uses old-style proportional figures; dates, tables and leaders use lining tabular figures so they align.
- Display (`.titlepage-name`), title (`.chapter-title`), italic dek (`.chapter-dek`), section title, body (`.prose`), small caps label (`.smcp`, `.topics`).
- Blockquotes are indented italic with `hanging-punctuation`; figure captions are small italic.

## 4. Layout & Components

- **Page**: one centered column (`--page-width: 46rem`), text capped at `--measure: 66ch`. The article "In this essay" list sits quietly in the right margin on wide screens; `.sidenote` sets notes in the left margin.
- **Section break**: a centered `* * *` (generated content with an empty alt) instead of rules.
- **Running header and colophon**: name in italic, three small-caps links, theme toggle; the footer closes with pages, elsewhere, and a line naming the typeface.
- **Chapter head**: centered title, italic dek, a meta line (date, reading time).
- **Contents entries** (`.entry`): serif title, italic dek, date and reading time set right behind a dotted leader, topics as small-caps text. Used for the writing index, home, projects and tag pages.
- **Drop cap**: `initial-letter` where supported, a plain float otherwise; purely visual.
- **Buttons**: square, 1px ink outline or ink fill. Never accent-filled.

## 5. Do's and Don'ts

### Do:
- Keep text at 62-68 characters and the page centered.
- Use real small caps and old-style figures; check `font-synthesis` stays off.
- Pair every new text token with a contrast check in both themes.
- Gate any motion on `html.motion-ok`.

### Don't:
- Don't use cream, sand or parchment grounds, gradients, glows, shadows or rounded card chrome.
- Don't set `#hashtag` chips or uppercase tracked eyebrows; topics are small-caps text.
- Don't add a second typeface for UI.
- Don't use the accent for anything but links, focus and current states.
