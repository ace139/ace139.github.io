---
name: Editorial Noir
description: A dark-first editorial system with cinematic lighting and serif-display typography.
colors:
  bg-void: "#030408"
  bg-dark: "#0a0d14"
  bg-elevated: "#12161f"
  surface: "#1a1f2b"
  text: "#f0f2f7"
  text-secondary: "#a0a8b8"
  text-muted: "#6b7a8a"
  border: "#252a38"
  accent: "#f43f5e"
  accent-glow: "#fb7185"
  accent-deep: "#e11d48"
  amber: "#f59e0b"
  amber-glow: "#fbbf24"
  light-bg: "#fafbfc"
  light-elevated: "#ffffff"
  light-surface: "#f3f4f6"
  light-text: "#111827"
  light-text-secondary: "#4b5563"
  light-muted: "#6b7280"
  light-border: "#e5e7eb"
  light-primary: "#e11d48"
  light-primary-hover: "#be123c"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2rem, 5vw + 1rem, 5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw + 1rem, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Roboto Slab, Georgia, serif"
    fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  code: "6px"
  input: "12px"
  pre: "16px"
  card: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "32px"
  section: "clamp(4rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0.875rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-glow}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0.875rem 1.75rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "0.875rem 1.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "2rem"
  pill:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
  pill-active:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.input}"
    padding: "0.875rem 1rem"
---

# Design System: Editorial Noir

## 1. Overview

**Creative North Star: "Editorial Noir"**

A dark-first editorial system that reads like a well-set magazine shot under cinematic lighting. The default surface is a near-black blue-undertoned void (`#0a0d14`), against which crisp cool-white text and a single rose-coral accent (`#f43f5e`) carry the page. Depth comes from soft, diffuse shadow and the occasional accent glow — not from heavy chrome. The personality is **rigorous, grounded, assured**: a practitioner's notebook with the production values of a print feature. Long-form reading is the product, so the type does the heavy lifting — a Playfair Display serif for display moments, Roboto Slab for the body of articles, and Plus Jakarta Sans for interface and headings.

This system explicitly rejects the looks named in PRODUCT.md. It is **not** a generic SaaS landing page (no hero-metric template, no identical icon-card grids, no gradient-on-navy). It is **not** corporate-healthcare sterile (no clinical blue-and-white, no stock-photo gloss). And it actively resists AI-slop sameness — the cream/paper editorial default is forbidden here; the void IS the paper. A light theme exists as a first-class equal for daytime reading, holding the same restraint with a near-white (`#fafbfc`) ground and a deepened crimson primary (`#e11d48`).

**Key Characteristics:**
- Dark-first, with a fully-equal light theme (both must clear WCAG 2.2 AA).
- One accent voice: rose-coral, with warm amber as a rare secondary.
- Serif display + serif reading body + sans interface — a tri-family editorial stack.
- Cinematic depth: soft shadows and accent glow, never hard chrome.
- Generous, fluid spacing and a 65ch reading measure.

## 2. Colors

A monochrome blue-black field, cool-white ink, and one warm accent that earns attention by rarity.

### Primary
- **Rose Coral** (`#f43f5e`): The single brand voice. Links, primary buttons, active states, focus rings, the reading-progress bar, section eyebrows. In light theme it deepens to **Crimson** (`#e11d48`) for contrast against white.
- **Rose Glow** (`#fb7185`): Hover/lit state of the accent — links and buttons brighten to this on hover.
- **Crimson Deep** (`#e11d48`): The darker accent stop, used in gradients and scrollbar thumbs.

### Secondary
- **Warm Amber** (`#f59e0b`): A rare secondary, paired with rose only in gradients (hero, reading-progress) and reserved emphasis. **Amber Glow** (`#fbbf24`) is its lit variant. Never a second general-purpose accent — it appears alongside rose, not instead of it.

### Neutral
- **Void** (`#030408`): The deepest background, for full-bleed cinematic moments behind glow.
- **Base Dark** (`#0a0d14`): The default page background.
- **Elevated** (`#12161f`): Cards and raised surfaces.
- **Surface** (`#1a1f2b`): Inputs, inline code, the next layer up.
- **Cool White** (`#f0f2f7`): Primary text on dark.
- **Slate Mist** (`#a0a8b8`): Secondary / supporting text on dark.
- **Muted Steel** (`#6b7a8a`): Muted labels and de-emphasized text (tuned up from `#5a6478` to pass AA).
- **Hairline** (`#252a38`): Borders and dividers on dark.
- Light-theme neutrals mirror these roles: ground `#fafbfc`, elevated `#ffffff`, surface `#f3f4f6`, ink `#111827`, secondary `#4b5563`, muted `#6b7280`, hairline `#e5e7eb`.

### Named Rules
**The One Voice Rule.** Rose-coral is the only accent that speaks on its own. Amber may accompany it in a gradient, never replace it and never appear as a competing standalone color. If a screen has two accents fighting, one is wrong.

**The Void-Is-Paper Rule.** The reading surface is dark by default. A warm cream/sand/parchment background is forbidden — that is the AI-editorial tell PRODUCT.md rejects. Warmth lives in the amber accent and the typography, never in the body background.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif)
**Reading Font:** Roboto Slab (with Georgia, serif)
**Interface Font:** Plus Jakarta Sans (with Inter, system-ui, sans-serif)

**Character:** A tri-family editorial stack that pairs on genuine contrast axes. Playfair's high-contrast didone serif provides the display drama; Roboto Slab's even slab gives long-form articles a warm, bookish reading texture; Plus Jakarta Sans keeps navigation, headings, and UI crisp and neutral. The serif/sans split is intentional — never two similar sans-serifs.

### Hierarchy
- **Display** (Playfair Display, 400, `clamp(2rem, 5vw+1rem, 5rem)`, line-height 1, letter-spacing -0.03em): Hero and feature moments only, via `.display-heading`. Reserved; not every heading.
- **Headline** (Plus Jakarta Sans, 600, `clamp(1.75rem, 3vw+1rem, 3rem)`, -0.02em): Page H1s and section titles.
- **Title** (Plus Jakarta Sans, 600, `clamp(1.25rem, 1.5vw+0.5rem, 1.5rem)`): Subsection headings, prose H3.
- **Body** (Roboto Slab, 400, `clamp(1rem, 0.9rem+0.5vw, 1.125rem)`, line-height 1.8): Article prose. Capped at a **65ch** measure (`.prose-width`).
- **Label** (Plus Jakarta Sans, 600, 0.75rem, letter-spacing 0.2em, uppercase): Eyebrows and meta — used deliberately, not reflexively (see rule).

### Named Rules
**The Reserved-Display Rule.** Playfair appears only where an editorial moment earns it (heroes, pull quotes). Default headings are Plus Jakarta Sans. Setting every heading in Playfair cheapens the display voice.

**The Earned-Eyebrow Rule.** The uppercase tracked label (`.section-eyebrow`) is a real part of the system, but it is NOT scaffolding for every section. One named eyebrow where it carries meaning is voice; an eyebrow above every heading is the AI grammar PRODUCT.md rejects. Default to no eyebrow.

## 4. Elevation

A hybrid of tonal layering and soft cinematic shadow. Depth is built first by stacking neutral tones (`bg-void` → `bg-dark` → `bg-elevated` → `surface`), then reinforced with large, diffuse, low-opacity shadows. On dark the shadows are near-black and atmospheric; on light they are a faint slate. Accent glow (a rose-tinted box-shadow) is a deliberate spotlight, not an everywhere effect.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 12px 40px rgba(0,0,0,0.25)`): Resting elevation for content cards. Light: `0 12px 40px rgba(15,23,42,0.06)`.
- **Soft** (`box-shadow: 0 20px 60px rgba(0,0,0,0.3)`): Larger panels and hovered cards. Light: `0 20px 60px rgba(15,23,42,0.08)`.
- **Button** (`box-shadow: 0 15px 30px rgba(244,63,94,0.25)`): The rose-tinted lift under primary buttons, deepening to `0 20px 40px rgba(244,63,94,0.35)` on hover.
- **Accent Glow** (`box-shadow: 0 0 40px rgba(244,63,94,0.3), 0 0 80px rgba(244,63,94,0.15)`): Cinematic spotlight for hero and signature moments only.

### Named Rules
**The Diffuse-Glow Rule.** Shadows are large, soft, and low-opacity — cinematic ambient light, never a hard 2014-app drop shadow. Audit test: if the shadow has a visible hard edge or a tight blur, it's wrong; widen the blur and lower the opacity.

## 5. Components

### Buttons
- **Shape:** Fully pill-rounded (`9999px`).
- **Primary:** Rose-coral fill, white text, rose-tinted shadow (`0 15px 30px rgba(244,63,94,0.25)`), padding `0.875rem 1.75rem`. Light theme uses crimson `#e11d48`.
- **Hover / Focus:** Lifts and scales (`translateY(-3px) scale(1.02)`), shadow deepens, background brightens to rose-glow. Eased on the signature `cubic-bezier(0.2, 0.8, 0.2, 1)` over 300ms.
- **Secondary:** Transparent with a hairline border; on hover the border and text take the accent and a faint rose wash (`rgba(244,63,94,0.1)`) fills.
- **Ghost:** Borderless muted text, tighter padding (`0.5rem 1rem`); accent on hover. For low-emphasis actions.

### Chips / Pills
- **Style:** Pill (`9999px`), hairline border, muted text, small (0.8125rem). Variants: `pill` (static tag), `pill-interactive` (hover takes accent + rose wash), `pill-active` (rose fill, white text), `pill-scrim` (translucent dark blur for use over imagery).
- **State:** Interactive pills are the tag filters; active = selected filter.

### Cards / Containers
- **Corner Style:** Generous `24px` (1.5rem) radius.
- **Background:** Elevated surface (`#12161f` dark / `#ffffff` light). A `card-gradient` variant fades a 5%-rose top into the elevated base.
- **Shadow Strategy:** Flat at rest; `card-hover` lifts `translateY(-8px)`, borders pick up a 30%-rose tint, and Soft + a faint Accent Glow combine. See Elevation.
- **Border:** 1px hairline (`#252a38` dark / `#e5e7eb` light).
- **Internal Padding:** `2rem`.

### Inputs / Fields
- **Style:** Surface fill, hairline border, `12px` radius, padding `0.875rem 1rem`.
- **Focus:** Border shifts to accent plus a 3px rose focus ring (`0 0 0 3px rgba(244,63,94,0.15)`). Outline is removed only because the ring replaces it — never remove focus indication outright.
- **Placeholder:** Muted; must still clear 4.5:1.

### Navigation
- Plus Jakarta Sans, restrained. Links rest in muted/secondary tone and take the rose accent on hover/active. Theme toggle (dark default) persists via localStorage. A fixed rose→amber reading-progress bar (3px) tracks article scroll.

### Signature: Prose (article body)
The reading experience is the signature component. Roboto Slab at 1.8 line-height on a 65ch measure, sans-serif H2/H3 for scan structure, rose underlined links (3px offset), `16px`-radius code blocks on the elevated surface, and a centered Playfair `.pull-quote` framed by hairline rules. This is where Editorial Noir earns its name.

## 6. Do's and Don'ts

### Do:
- **Do** keep the void as the reading surface. Dark is the default; the light theme is a true near-white (`#fafbfc`), never a warm cream.
- **Do** let rose-coral (`#f43f5e`) be the single accent voice, used sparingly so its appearances mean something.
- **Do** set long-form body in Roboto Slab at 1.8 line-height, capped at 65ch.
- **Do** reserve Playfair Display for display moments and pull quotes.
- **Do** ease motion on `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out), 200–300ms, and ship a `prefers-reduced-motion` alternative for every animation.
- **Do** use large, diffuse, low-opacity shadows for cinematic depth.

### Don't:
- **Don't** ship a generic SaaS landing — no hero-metric template (big number + small label + stat row), no identical icon-heading-text card grids, no gradient-on-navy.
- **Don't** drift into corporate-healthcare sterility — no clinical blue-and-white, no stock-photo-clinician tone.
- **Don't** lean on AI-slop tells: no uppercase tracked eyebrow above every section (the `.section-eyebrow` is deliberate, not default), and never a cream/sand/parchment body background.
- **Don't** use `.gradient-text` / `background-clip: text` for emphasis. It exists in the utilities but is a decorative tell; emphasize with weight, size, or the solid accent instead.
- **Don't** use a colored `border-left` greater than 1px as a side-stripe accent on cards or callouts. The single exception already in the system is the prose `blockquote`; do not extend the pattern to other components.
- **Don't** reach for `.glass-panel` decoratively. Blur/glass is rare and purposeful here, or absent.
- **Don't** set every heading in Playfair, or let amber compete with rose as a second standalone accent.
