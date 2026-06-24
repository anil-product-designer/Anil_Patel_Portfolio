# Portfolio Component Rules & Design Audit
> **Role: Senior Frontend Auditor + Design Systems Engineer**  
> This document is the single source of truth for building and auditing every component across the portfolio. It is extracted from actual live code — not aspirational rules. No sugar-coating.

---

## AUDIT SUMMARY (Honest Assessment)

### What is working ✅
- Design token system with CSS custom properties is solid.
- Noise texture overlay creates consistent premium feel.
- Scroll-reveal animation pattern is consistent across all case studies.
- Color palette coherence — dark backgrounds, accent-green or accent-violet per case study, maintained well.
- Section label pattern (`section-label → section-title → section-sub`) is consistent.
- Section alternating backgrounds (odd/even `var(--bg)` / `var(--bg2)`) implemented correctly.

### What is broken or inconsistent ⚠️
- **Font family conflict** — `responsive.md` says body should use `'DM Mono', monospace`. Actual code uses `'Stage Grotesk', sans-serif`. This is a direct conflict between the documented standard and implementation. Heading font `Bricolage Grotesque` is used in trailtribe but `Syne` is the standard in `responsive.md`. These are NOT interchangeable — do not mix them.
- **CSS is 100% inline per file** — `transify-case-study.html` links `css/styles.css` AND has a full `<style>` block. This creates duplicate and conflicting rules. No other case study does this. It is a bug.
- **Missing media queries in multiple files** — `responsive.md` defines 6 breakpoints. Most case study files only implement 4 (missing `max-width: 1280px` and sometimes `max-width: 768px` entirely).
- **Duplicate/conflicting `.edge-grid`, `.comp-item`, `.consequence-item`** — trailtribe has these defined TWICE: once in the `<style>` block (correct), once in the injected "restored" CSS block at line 795+. The injected block overrides the styled block inconsistently.
- **SVG zero-sizing issue** — partially fixed with `!important` overrides. Root cause: SVG `width`/`height` attributes are set on the element but CSS `display: block` is absent in icon containers. Fix was patched, not solved properly.
- **Classes added via injection** (`.user-journey`, `.testing-grid`, `.consequence-item`) are defined after the existing same-name definitions. `.consequence-item` is defined twice with DIFFERENT styles — once as a `display: flex` item with `::before` arrow, and again as a plain padded block. This is a real conflict.
- **No `max-width` on sections** — hero titles can stretch to full viewport width on 4K/ultrawide screens. No `max-width` cap on content columns.
- **`transition: all`** is used frequently — this is a performance anti-pattern. Use specific property transitions instead.
- **Responsiveness is mostly untested below 600px** — no evidence of mobile-first visual QA. The `@media (max-width: 600px)` blocks exist in code but several component-specific classes inside them (`.edge-grid`, `.ia-nav`, `.kpi-grid`) stack to `grid-template-columns: 1fr` but have no padding adjustments.

---

## PART 1 — DESIGN TOKENS

### Color System

**Case Study Files (green theme — trailtribe)**
```css
:root {
  --bg:           #060a08;   /* darkest background */
  --bg2:          #0b100d;   /* card backgrounds, even sections */
  --bg3:          #111813;   /* hover states, elevated items */
  --bg4:          #18211a;   /* deepest card insets */
  --green:        #059669;
  --green-bright: #34d399;   /* primary accent, icons, labels */
  --green-dim:    #064e3b;   /* badge backgrounds */
  --green-glow:   rgba(5, 150, 105, 0.13);
  --text:         #edfaf4;   /* primary text */
  --text-muted:   #6b9e82;   /* secondary/body text */
  --text-dim:     #334d3e;   /* de-emphasized labels */
  --line:         rgba(255, 255, 255, 0.06);
  --line-green:   rgba(5, 150, 105, 0.2);
  --white:        #ffffff;
}
```

**Global Pages (`index.html`, `about.html`, `contact.html`) — from `styles.css`**
```css
:root {
  --bg:             #0a0a0f;
  --bg2:            #10101a;
  --bg3:            #16162a;
  --violet:         #7c3aed;
  --violet-bright:  #a855f7;
  --violet-dim:     #4c1d95;
  --violet-glow:    rgba(124, 58, 237, 0.15);
  --text:           #f1f0ff;
  --text-muted:     #8884a8;
  --text-dim:       #4e4c6b;
  --line:           rgba(124, 58, 237, 0.18);
  --gutter:         24px;
}
```

**Case Study Files (purple theme — transify, rumble, idp)**
```css
/* Same global violet tokens via styles.css — NO separate :root block needed */
--purple:        #7c3aed;   /* same as --violet in styles.css */
--purple-bright: #a855f7;   /* same as --violet-bright */
--line-purple:   rgba(124, 58, 237, 0.2);
```

> ⚠️ **Conflict Note:** `transify-case-study.html` links `css/styles.css` AND has its own `<style>` block redefining body, nav, etc. The `<style>` block partially overrides `styles.css`. Other case studies do NOT link `styles.css`. Pick one approach per file — DO NOT mix.

---

## PART 2 — TYPOGRAPHY

### Font Stack

| Context | Font | Weight | Use |
|---|---|---|---|
| **Display headings** | `'Bricolage Grotesque', sans-serif` (trailtribe) or `'Syne', sans-serif` (others) | 800 | Section titles, hero h1, card titles |
| **Body / labels** | `'Stage Grotesk', sans-serif` | 400 | ALL body text in actual code |
| **Italic accents** | `'Fraunces', serif` | 300 italic | Pull quotes, hero subtitles, section-sub |
| **Code / tags** | `'DM Mono', monospace` | 400 | NOT actually used as body font |

> ⚠️ **Conflict:** `responsive.md` documents `'DM Mono'` as body font. Actual implementation uses `'Stage Grotesk'`. The boilerplate in `responsive.md` section 19 is wrong/outdated — DO NOT follow it for new files. Use `'Stage Grotesk'` as body font to match existing pages.

### Type Scale (Actual Values in Code)

| Element | Value | Notes |
|---|---|---|
| Hero title | `clamp(52px, 8vw, 118px)` | `trailtribe` — correct |
| Section title | `clamp(30px, 4vw, 52px)` | Actual, not the `clamp(28px, 5vw, 52px)` in `responsive.md` |
| Impact headline | `clamp(40px, 6vw, 80px)` | Big statement blocks |
| Final block title | `clamp(36px, 5vw, 72px)` | End of case study |
| Section-sub | `20px` fixed | Fraunces italic |
| Body text (cards) | `13–15px` | DM Mono or Stage Grotesk |
| Labels/eyebrows | `10–11px` | `letter-spacing: 0.2–0.25em` uppercase |

---

## PART 3 — SPACING SCALE

Only use these values. No arbitrary pixel values.

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 112 · 120 · 160
```

### Section Vertical Padding (Case Studies)

| Breakpoint | Section padding |
|---|---|
| Default (≥1280px) | `112px 48px` |
| Large (≥1600px) | `120px 80px` |
| ≤900px | `72px 24px` |
| ≤600px | `60px 16px` |

### Inner Component Spacing

| Pattern | Value |
|---|---|
| Two-column internal gap | `0` (use internal padding instead) |
| Two-col left padding | `padding-right: 80px` |
| Two-col right padding | `padding-left: 80px` |
| Card grid gap | `24px` |
| Decision card gap (number→body) | `80px` |
| Section label → title gap | `margin-bottom: 56px` on `.section-label` |
| Title → sub gap | `margin-bottom: 20px` on `.section-title` |
| Sub → content gap | `margin-bottom: 56px` on `.section-sub` |

---

## PART 4 — BREAKPOINTS (Official Order)

Write ALL breakpoints in this exact order, top to bottom, in every file:

```css
/* 1. Large desktop */
@media (min-width: 1600px) { ... }

/* 2. Tablet (two-column grids stack here) */
@media (max-width: 1024px) { ... }

/* 3. Mobile landscape (nav, hero-meta, decision cards) */
@media (max-width: 900px) { ... }

/* 4. Mobile (border cleanup, padding reduction) */
@media (max-width: 768px) { ... }

/* 5. Small mobile (nav strip, font downsizing) */
@media (max-width: 600px) { ... }
```

> ⚠️ `max-width: 1280px` breakpoint exists in `styles.css` only — for global pages. Do NOT add it to case study files.

---

## PART 5 — LAYOUT PATTERNS

### A. Fixed Navigation

```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  background: rgba(6, 10, 8, 0.88); /* use per-case-study bg color */
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--line);
}

/* ≥1600px */
@media (min-width: 1600px) { nav { padding: 20px 80px; } }
/* ≤900px */
@media (max-width: 900px)  { nav { padding: 16px 24px; } }
/* ≤600px */
@media (max-width: 600px)  {
  nav { padding: 12px 16px; }
  .nav-meta span:not(.nav-tag) { display: none; }
}
```

### B. Hero Section

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 48px 80px;
  padding-top: 120px; /* compensates for fixed nav */
  position: relative;
  overflow: hidden;
  border-top: none; /* hero has no top border */
}

/* ≥1600px */ @media (min-width: 1600px) { .hero { padding: 0 80px 80px; } }
/* ≤900px  */ @media (max-width: 900px)  { .hero { padding: 0 24px 60px; } }
/* ≤600px  */ @media (max-width: 600px)  { .hero { padding: 0 16px 40px; } }
```

Hero meta strip (4 columns):
```css
.hero-meta {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line);
  padding-top: 40px;
}
/* ≤900px → 2×2 */
@media (max-width: 900px) {
  .hero-meta { grid-template-columns: 1fr 1fr; gap: 20px; }
  .hero-meta-item { border-right: none; padding: 0; }
}
```

### C. Two-Column Splits

**Rule:** All two-column layouts use `gap: 0` and internal padding, not `gap: Xpx`. The divider is a `border-right: 1px solid var(--line)` on the left column.

```css
.THING-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.THING-left  { padding-right: 80px; border-right: 1px solid var(--line); }
.THING-right { padding-left: 80px; }

@media (max-width: 1024px) {
  .THING-grid { grid-template-columns: 1fr; }
  .THING-left  { padding-right: 0; border-right: none; border-bottom: 1px solid var(--line); padding-bottom: 48px; margin-bottom: 48px; }
  .THING-right { padding-left: 0; }
}
@media (max-width: 768px) {
  .THING-left { padding-bottom: 40px; margin-bottom: 0; }
}
@media (max-width: 600px) {
  .THING-left, .THING-right { padding: 0 !important; border: none !important; }
}
```

### D. Decision Cards

```css
.decision-card {
  border-top: 1px solid var(--line);
  padding: 64px 0;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 80px;
  align-items: start;
}

@media (max-width: 900px) {
  .decision-card { grid-template-columns: 1fr; gap: 32px; }
}
@media (max-width: 600px) {
  .decision-card { padding: 24px 0; }
  .decision-number { font-size: 40px; }
  .decision-headline { font-size: 20px; }
}
```

### E. Repeat Grid Cards (4-col, 3-col, 2-col)

```css
/* 4-column grids: research-methods, kpi-grid, mono-grid, ia-nav */
.four-col-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

@media (max-width: 1024px) { .four-col-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px)  { .four-col-grid { grid-template-columns: 1fr; } }

/* 3-column grids: edge-cases, impact-row */
.three-col-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

@media (max-width: 900px)  { .three-col-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px)  { .three-col-grid { grid-template-columns: 1fr; } }
```

---

## PART 6 — COMPONENT RULES

### Rule 1 — SVG Icon Sizing (MANDATORY)

Every inline SVG inside a container class MUST have:
1. A `width` and `height` attribute on the `<svg>` element
2. CSS override to prevent flex-shrink collapse

```css
/* The global lock — add this to every case study file */
.mono-icon svg,
.ia-icon svg,
.kpi-icon svg,
.integration-icon svg,
.flow-item-icon svg,
.edge-icon svg {
  width: 24px !important;
  height: 24px !important;
  flex-shrink: 0 !important;
  display: block;
}
```

> ⚠️ **Current status:** Fixed in trailtribe with `!important` overrides at 32px. Other files (idp, transify, rumble) were fixed with injected CSS. Root cause NOT fixed — SVG containers do not set `display: flex` + `align-items: center` before the SVG child, causing height collapse.

### Rule 2 — Flex Containers Must Declare Wrap

Any horizontal flex container with dynamic children MUST have `flex-wrap: wrap`:

```css
/* Correct */
.expansion-items { display: flex; flex-wrap: wrap; gap: 12px; }
.final-tags      { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }

/* Wrong — will overflow on mobile */
.nav-meta        { display: flex; gap: 32px; }  /* no wrap — OK only because ≤600px hides children */
```

### Rule 3 — Icon + Text Alignment

Any element with both an SVG icon and text MUST use `inline-flex`:

```css
.badge         { display: inline-flex; align-items: center; gap: 8px; }
.comp-item     { display: flex; align-items: center; gap: 14px; }
.tech-item     { display: flex; align-items: center; gap: 12px; }
.decision-badge { display: inline-flex; align-items: center; }
```

**Do NOT use** `display: inline-block` for badge/pill components that contain icons.

### Rule 4 — Spacing: Gap Over Margin

Inside flex/grid containers, use `gap` — not `margin-right`, `margin-bottom` on children. Exception: standalone block components between sections use `margin-top`/`margin-bottom`.

```css
/* Correct */
.integration-list { display: flex; flex-direction: column; gap: 10px; }

/* Wrong */
.integration-item { margin-bottom: 10px; } /* use gap on parent instead */
```

Exception — OK to use margin for section-level spacing:
```css
.expansion-strip { margin-top: 64px; margin-bottom: 80px; }
```

### Rule 5 — Pill / Badge Components

All pills and badges must use `inline-flex` (not `inline-block`), `align-items: center`, and explicit padding:

```css
.pill-component {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;        /* vertical: 4–8px / horizontal: 10–16px */
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;        /* sharp corners — portfolio aesthetic */
  border: 1px solid;
  white-space: nowrap;       /* never let a pill wrap mid-word */
}
```

### Rule 6 — Section Label Pattern

Every section starts with this exact 3-layer header:

```html
<div class="section-label reveal">
  <span class="sl-text">Section Name</span>
  <span class="sl-num">/ 01</span>
</div>
<div class="section-title reveal">Headline text.</div>
<p class="section-sub reveal">One-liner italic description.</p>
```

**Section numbers must be sequential** — `/ 01`, `/ 02`, … across the page. Never skip.

### Rule 7 — Scroll Reveal

Every main content block must have the `.reveal` class. The IntersectionObserver script must be present in every file.

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```

```js
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));
```

### Rule 8 — Hover Transitions

Never use `transition: all`. Specify the exact property:

```css
/* Wrong */
.card { transition: all 0.2s ease; }

/* Correct */
.card { transition: border-color 0.2s ease, background 0.2s ease; }
.btn  { transition: transform 0.2s ease, box-shadow 0.2s ease; }
```

### Rule 9 — Icon Contextuality

Every icon must be semantically appropriate to its content. **Never reuse the same SVG for different meanings across a grid.** (This was the issue in Edge Cases section — all 6 cards had the same alert-circle icon.)

---

## PART 7 — NOISE TEXTURE OVERLAY

Must be in every case study and page file:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1000;
  opacity: 0.55; /* trailtribe uses 0.55, transify uses 0.6 — standardize to 0.55 */
}
```

---

## PART 8 — KNOWN CONFLICTS (DO NOT IGNORE)

| # | Conflict | Location | Status |
|---|---|---|---|
| 1 | `.consequence-item` defined twice with different styles | `trailtribe-case-study.html` lines ~480 and ~914 | ⚠️ Active conflict. Line 914 overrides line 480. |
| 2 | `.edge-grid`, `.comp-item` defined twice (style block + injected block) | `trailtribe-case-study.html` lines 490 and 873 | ⚠️ Active conflict — bottom definition wins. |
| 3 | Body font `'Stage Grotesk'` vs `'DM Mono'` documented in `responsive.md` | All case study files vs `responsive.md` section 5 | ⚠️ Docs are wrong. Code uses Stage Grotesk. |
| 4 | `transify-case-study.html` links `styles.css` AND has local `<style>` block | `transify-case-study.html` line 13 + line 15 | ⚠️ Causes cascading conflicts with `--violet` tokens. |
| 5 | `responsive.md` boilerplate (Section 19) uses `'DM Mono'` body and `'Syne'` headings | `responsive.md` lines 1023–1028 | ⚠️ Outdated. Do not copy-paste this for new files. |
| 6 | Noise texture opacity: `0.55` (trailtribe) vs `0.6` (transify) | Separate files | ⚠️ Minor. Standardize to `0.55`. |

---

## PART 9 — STEPS NOT TAKEN (Improvements You Can Make)

These are real gaps in the current implementation that are **changeable**:

### High Priority

1. **Remove duplicate CSS blocks in trailtribe** — The "RESTORED MISSING BASE CSS" block at line 795+ was added as a patch. Move all those rules into the proper `<style>` block and remove the duplicates. This affects `.consequence-item`, `.edge-grid`, and 15+ other classes.

2. **Fix transify CSS architecture** — Either remove the `<link rel="stylesheet" href="css/styles.css">` from `transify-case-study.html` and copy needed tokens into the `<style>` block, OR remove the local `<style>` block entirely and put everything in `styles.css`. Right now it's both, which means any change to `styles.css` can break the case study unpredictably.

3. **SVG icon sizing — fix root cause** — Instead of `!important` patches, the fix should be:
   ```css
   /* On the icon container, not just the SVG */
   .mono-icon, .ia-icon, .kpi-icon, .edge-icon {
     display: flex;
     align-items: center;
     flex-shrink: 0;
   }
   .mono-icon svg, .ia-icon svg, .kpi-icon svg, .edge-icon svg {
     width: 24px;
     height: 24px;
     display: block;
     flex-shrink: 0;
   }
   ```

4. **Update `responsive.md` boilerplate** — Section 19 is outdated. The font stack and color tokens are wrong. Anyone using it to create a new case study will produce an inconsistent page.

### Medium Priority

5. **Add `max-width` on content** — Hero titles and section content have no max-width cap. On ultrawide monitors (2560px+), text can stretch uncomfortably. Add:
   ```css
   .hero { max-width: 1600px; margin: 0 auto; } /* or use width: 100% */
   section > * { max-width: 1400px; } /* optional content cap */
   ```

6. **Replace `transition: all`** — Found in `.integration-item`, `.expansion-pill`, `.impact-item`, and others. Replace with targeted property transitions.

7. **`decision-badge` missing `display`** — Current code: `display: inline-block`. Per Rule 3, this should be `display: inline-flex; align-items: center;` — especially if an icon is ever added inside it.

### Low Priority (Polish)

8. **Noise texture opacity** — Standardize all files to `opacity: 0.55`.

9. **Standardize `border-radius`** — Cards use `4px`, `8px`, and `2px` seemingly randomly. The portfolio aesthetic favors `2px` for pills/badges, `4px` for cards. Do not use `8px` on flat dark cards.

10. **Light mode is incomplete** — `.light-mode` CSS is defined in trailtribe but only partially tested. Several components (`edge-item`, `comp-item`, `journey-step`) have no light mode overrides. Either complete it or remove the toggle entirely.

---

## PART 10 — QUICK AUDIT CHECKLIST

Before marking any component done, verify:

- [ ] Does it use `display: flex/grid`? Not floats, not `position: absolute` for layout.
- [ ] Does every flex container with multiple children have `flex-wrap: wrap`?
- [ ] Does every icon container prevent `flex-shrink` collapse?
- [ ] Are all SVG icons contextually appropriate (not copy-pasted reused)?
- [ ] Is spacing from the spacing scale? (4/8/12/16/24/32/40/48/64/80/96/112/120)
- [ ] Is the class defined ONCE in the stylesheet? (no duplicate definitions)
- [ ] Does it stack/reflow correctly at 1024px, 900px, 600px?
- [ ] Does it use `transition: property` (not `transition: all`)?
- [ ] Is the section-label → section-title → section-sub hierarchy in place?
- [ ] Does the section have `border-top: 1px solid var(--line)` and alternating bg?
- [ ] Is the `.reveal` class added to all major content blocks?

---

*Last audited: June 2026. Based on: `trailtribe-case-study.html`, `transify-case-study.html`, `rumble-rewards-case-study.html`, `idp-case-study.html`, `css/styles.css`, `responsive.md`.*
