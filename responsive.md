# Responsive Design System — Portfolio
> **Reference guide for building every new case study, page, or component exactly the way the rest of the portfolio is built.**  
> Keep this file open while writing any new HTML/CSS. Every pattern, value, and rule here is extracted directly from the existing code.

---

## Table of Contents
1. [Breakpoints](#1-breakpoints)
2. [Grid System](#2-grid-system)
3. [Container Padding](#3-container-padding)
4. [Section Vertical Spacing](#4-section-vertical-spacing)
5. [Typography & Font Scaling](#5-typography--font-scaling)
6. [Color Tokens](#6-color-tokens)
7. [Spacing Scale](#7-spacing-scale)
8. [Navigation Pattern](#8-navigation-pattern--case-study-nav)
9. [Hero Section Pattern](#9-hero-section-pattern)
10. [Section Label Pattern](#10-section-label-pattern)
11. [Two-Column Layout Pattern](#11-two-column-layout-pattern)
12. [Decision / Content Card Pattern](#12-decision--content-card-pattern)
13. [Scroll Reveal Animations](#13-scroll-reveal-animations)
14. [Keyframe Animations](#14-keyframe-animations)
15. [Hover & Transition Rules](#15-hover--transition-rules)
16. [Noise Texture Overlay](#16-noise-texture-overlay)
17. [Project Navigation Footer](#17-project-navigation-footer)
18. [Case Study Page Structure Checklist](#18-case-study-page-structure-checklist)
19. [Quick-Copy Boilerplate](#19-quick-copy-boilerplate)

---

## 1. Breakpoints

These are the exact `@media` breakpoints used across the whole portfolio. Use them in this exact order (large → small).

| Name | Rule | Cols | Use |
|---|---|---|---|
| Large Desktop | `@media (min-width: 1600px)` | 12 | Increase nav/section padding to `80px` |
| Small Desktop | `@media (max-width: 1280px)` | 12 | Only in `styles.css` (index/about pages) — tighten image sizes |
| Tablet | `@media (max-width: 1024px)` | 8 | Stack two-column grids → single column |
| Mobile Landscape | `@media (max-width: 900px)` | — | Adjust nav padding, hero-meta to 2-col, stack decision cards |
| Mobile | `@media (max-width: 768px)` | 4 | Full-stack layout, hamburger menu visible |
| Small Mobile | `@media (max-width: 600px)` | — | Reduce section padding, smaller font overrides, hide nav labels |
| XS Mobile | `@media (max-width: 480px)` | — | Only in `styles.css` for index page — minimum spacing |

> **Rule:** Always write the `min-width: 1600px` block first, then descend from `1280px` down. Never skip a breakpoint that was already used in another file.

---

## 2. Grid System

### Global pages (`index.html`, `about.html`, `contact.html`)

```css
/* 12-column grid — desktop default */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter); /* 24px */
}

/* Tablet → 8-column */
@media (max-width: 1024px) {
  .grid { grid-template-columns: repeat(8, 1fr); }
}

/* Mobile → 4-column */
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
}
```

### Case Study pages (`*-case-study.html`)

Case studies don't use the shared `.grid` class. They use inline two-column grids:

```css
/* Two-column split (e.g. platform-grid, role-grid, problem-grid) */
.platform-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0; /* padding used internally */
}

/* Tablet: stack to 1 column */
@media (max-width: 1024px) {
  .platform-grid { grid-template-columns: 1fr; }
}

/* Mobile: stays single column (already stacked) */
```

### Common Column Spans (global pages)

| Element | Desktop (12-col) | Tablet (8-col) | Mobile (4-col) |
|---|---|---|---|
| Hero content | `1 / span 7` | `1 / span 5` | `span 4` |
| Hero image | `9 / span 4` | `6 / span 3` | `span 4` |
| About text | `1 / span 6` | `1 / span 4` | `span 4` |
| About visual | `7 / span 6` | `5 / span 4` | `span 4` |
| About-hero content | `1 / span 6` | `1 / span 4` | `span 4` |
| About-hero image | `7 / span 6` | `5 / span 4` | `span 4` |
| Experience intro | `1 / span 5` | `1 / span 3` | `span 4` |
| Experience list | `7 / span 6` | `5 / span 4` | `span 4` |
| Philosophy content | `2 / span 10` | `span 8` | `span 4` |
| Metric card | `span 4` (3 per row) | `auto` | `auto` (2-col) |
| Specialization card | `span 4` (3 per row) | `span 4` (2 per row) | `span 4` (1 per row) |
| Working-style card | `span 3` (4 per row) | `span 4` (2 per row) | `span 2` (2 per row) |
| Footer brand | `span 4` | `span 8` | `span 4` |
| Footer nav/social | `span 4` each | `span 4` each | `span 2` each |

---

## 3. Container Padding

```css
/* Default (≥1280px) */
.container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 48px;
  width: 100%;
}

/* Large screens ≥1600px */
@media (min-width: 1600px) {
  .container { padding: 0 80px; }
}

/* Tablet ≤1024px */
@media (max-width: 1024px) {
  .container { padding: 0 40px; }
}

/* Mobile ≤768px */
@media (max-width: 768px) {
  .container { padding: 0 24px; }
}

/* XS Mobile ≤480px */
@media (max-width: 480px) {
  .container { padding: 0 16px; }
}
```

### Case Study page inline padding (no `.container` class)

```css
/* Default section/nav padding for case study pages */
nav      { padding: 20px 48px; }
section  { padding: 112px 48px; }
.hero    { padding: 0 48px 80px; }

/* ≥1600px */
@media (min-width: 1600px) {
  nav      { padding: 20px 80px; }
  section  { padding: 120px 80px; }
  .hero    { padding: 0 80px 80px; }
}

/* ≤900px */
@media (max-width: 900px) {
  nav      { padding: 16px 24px; }
  section  { padding: 72px 24px; }
  .hero    { padding: 0 24px 60px; }
}

/* ≤600px */
@media (max-width: 600px) {
  nav      { padding: 12px 16px; }
  section  { padding: 60px 16px; }
  .hero    { padding: 0 16px 40px; }
}
```

---

## 4. Section Vertical Spacing

### Global pages — CSS custom property tokens

```css
/* Desktop */
.about, .work, .philosophy, .contact-strip,
.about-hero, .thinking-statement, .experience,
.specialization, .working-style, .contact-page,
.project-hero {
  padding: var(--space-120) 0; /* 120px top/bottom */
}

/* Tablet ≤1024px */
@media (max-width: 1024px) {
  /* These sections → 80px */
  padding-top: var(--space-80) !important;
  padding-bottom: var(--space-80) !important;
}

/* Mobile ≤768px */
@media (max-width: 768px) {
  /* These sections → 64px */
  padding-top: var(--space-64) !important;
  padding-bottom: var(--space-64) !important;
}
```

### Case Study pages — pixel values

| Breakpoint | Section padding (top/bottom) |
|---|---|
| Desktop | `112px 48px` |
| ≥1600px | `120px 80px` |
| ≤900px | `72px 24px` |
| ≤600px | `60px 16px` (some sections use `48px 20px`) |

---

## 5. Typography & Font Scaling

### Font Families (copy this exact `<link>` into every new file)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap"
  rel="stylesheet">
```

### Font Role Map

| Font | Family | Use |
|---|---|---|
| **Syne** | `'Syne', sans-serif` | All **display headings**, logo, section titles, card titles, nav logo |
| **DM Mono** | `'DM Mono', monospace` | **Body text**, labels, tags, nav links, form inputs, all `<body>` text |
| **Fraunces** | `'Fraunces', serif` | **Italic accents** — subtitles, philosophy quotes, pullquotes, hero subtitles |

### Body Base

```css
body {
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  line-height: 1.7;
}
```

### Fluid Typography — `clamp()` Reference Table

Use `clamp(min, fluid, max)`. The `fluid` value is a `vw` unit that scales with viewport width.

| Element | Rule | Used In |
|---|---|---|
| **Page/Case Study Hero Title (XL)** | `clamp(40px, 9vw, 118–120px)` | Rumble, Transify, IDP hero |
| **About-hero / Contact-page Title** | `clamp(48px, 7vw, 96px)` | `styles.css` |
| **Project Title** | `clamp(48px, 6vw, 96px)` | `styles.css` |
| **Home Hero Headline** | `clamp(40px, 7vw, 80px)` | `styles.css` |
| **Section Title (case studies)** | `clamp(28px, 5vw, 52–56px)` | All case studies |
| **Philosophy / Thinking Statement** | `clamp(28px, 4vw, 56px)` | `styles.css` |
| **Contact Strip H2** | `clamp(32px, 4vw, 60px)` | `styles.css` |
| **Next/Final Project Title** | `clamp(32px, 5vw, 64px)` | Case study footers |
| **About-hero body / Contact intro** | `clamp(20px, 1.4vw, 24px)` | `styles.css` |
| **Hero Headline (mobile override)** | `clamp(36px, 10vw, 52px)` | `styles.css` ≤768px |
| **Hero Headline (XS override)** | `clamp(30px, 9vw, 40px)` | `styles.css` ≤480px |
| **Philosophy (mobile override)** | `clamp(22px, 5.5vw, 34px)` | `styles.css` ≤768px |
| **Contact Strip H2 (mobile override)** | `clamp(26px, 6vw, 40px)` | `styles.css` ≤768px |
| **Case Study Section Title (600px)** | `clamp(26px, 8vw, 36px)` | TrailTribe ≤600px |

### Fixed Font Sizes — Label Hierarchy

| Role | Size | Font | Transforms |
|---|---|---|---|
| Section label / eyebrow | `10–11px` | DM Mono | `uppercase`, `letter-spacing: 0.2–0.25em` |
| Nav links | `14px` | DM Mono | `uppercase`, `letter-spacing: 0.1em` |
| Nav logo | `13–16px` | Syne 800 | `uppercase`, `letter-spacing: 0.15em` |
| Nav tag badge | `10px` | DM Mono | `uppercase`, `letter-spacing: 0.12em` |
| Card / meta label | `11px` | DM Mono | `uppercase`, `letter-spacing: 0.15–0.18em` |
| Body paragraph | `15–18px` | DM Mono | normal |
| Insight / body card text | `13px` | DM Mono | normal |
| Button | `12–13px` | DM Mono | `uppercase`, `letter-spacing: 0.05–0.1em` |
| Footer micro | `11px` | DM Mono | `uppercase`, `letter-spacing: 0.1em` |

### Heading Weights & Line Heights

```css
/* Display heading — Syne */
font-family: 'Syne', sans-serif;
font-weight: 800;
line-height: 0.92–0.95;        /* tight */
letter-spacing: -0.02em to -0.03em;

/* Section title — Syne */
font-weight: 700–800;
line-height: 1.05;
letter-spacing: -0.02em;

/* Card title — Syne */
font-weight: 700;
font-size: 16–24px;
letter-spacing: -0.01em;

/* Italic pull-quote — Fraunces */
font-weight: 300;
font-style: italic;
line-height: 1.4–1.6;
```

---

## 6. Color Tokens

### Dark Mode (Default) — Global Pages

```css
:root {
  --bg: #0a0a0f;
  --bg2: #10101a;
  --bg3: #16162a;
  --violet: #7c3aed;
  --violet-bright: #a855f7;
  --violet-dim: #4c1d95;
  --violet-glow: rgba(124, 58, 237, 0.15);
  --text: #f1f0ff;
  --text-muted: #8884a8;
  --text-dim: #4e4c6b;
  --line: rgba(124, 58, 237, 0.18);
  --accent-green: #34d399;
  --accent-amber: #fbbf24;
  --accent-red: #f87171;
  --accent-indigo: #818cf8;
  --header-bg: rgba(10, 10, 15, 0.9);
  --nav-height: 72px;
  --gutter: 24px;
}
```

### Light Mode — Global Pages

```css
.light-mode {
  --bg: #f8f8fb;
  --bg2: #f1f0ff;
  --bg3: #e8e6ff;
  --violet-bright: #6d28d9;
  --violet-dim: #c4b5fd;
  --violet-glow: rgba(124, 58, 237, 0.08);
  --text: #0a0a14;
  --text-muted: #5a5775;
  --text-dim: #9492b0;
  --line: rgba(124, 58, 237, 0.12);
  --header-bg: rgba(248, 248, 251, 0.9);
}
```

### Case Study Pages — Darker tokens (self-contained `<style>`)

```css
:root {
  --bg: #080808;
  --bg2: #0f0f0f;
  --bg3: #161616;
  --bg4: #1c1c1c;
  --purple: #7c3aed;
  --purple-bright: #a855f7;
  --purple-dim: #3b0764;
  --purple-glow: rgba(124, 58, 237, 0.13);
  --text: #f5f5f5;
  --text-muted: #888888;
  --text-dim: #444444;
  --line: rgba(255, 255, 255, 0.07);
  --line-purple: rgba(124, 58, 237, 0.2);
  --white: #ffffff;
}
```

> **Note:** Case studies use `--purple-bright` and `--purple` where global pages use `--violet-bright` and `--violet`. They are the same hex values.

### Accent Colors for Specific Case Studies

```css
/* TrailTribe (green theme) */
--green-bright: #34d399;
--green-glow: rgba(52, 211, 153, 0.1);
--line-green: rgba(52, 211, 153, 0.2);
```

---

## 7. Spacing Scale

Only ever use these tokens. Do not write arbitrary pixel values for margins/paddings on new pages.

```css
--space-4:   4px;
--space-8:   8px;
--space-12:  12px;
--space-16:  16px;
--space-24:  24px;
--space-32:  32px;
--space-48:  48px;
--space-64:  64px;
--space-80:  80px;
--space-96:  96px;
--space-120: 120px;
--space-160: 160px;
```

> Case study pages don't import `styles.css`, so use the exact pixel values (`48px`, `80px`, `120px`, etc.) directly.

---

## 8. Navigation Pattern — Case Study Nav

Every case study uses a fixed top nav with this exact structure:

```html
<nav>
  <a href="index.html" class="nav-logo">PROJECT NAME</a>
  <div class="nav-meta">
    <a href="index.html" class="nav-back-link">Home</a>
    <span>Context · Type · Category</span>
    <span class="nav-tag">Case Study · YEAR</span>
    <div class="theme-toggle" onclick="toggleTheme()">
      <span class="sun-icon">☀️</span>
      <span class="moon-icon">🌙</span>
    </div>
  </div>
</nav>
```

```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  background: rgba(8, 8, 8, 0.88);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--line);
}

.nav-logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.15em;
  color: var(--purple-bright);
  text-transform: uppercase;
}

.nav-meta { display: flex; gap: 32px; align-items: center; }
.nav-meta span { font-size: 11px; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; }

.nav-tag {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  background: var(--purple-dim); color: var(--purple-bright);
  padding: 4px 10px; border-radius: 2px; border: 1px solid var(--purple);
}

/* ≤600px: hide descriptive span, keep tag */
@media (max-width: 600px) {
  .nav-meta span:not(.nav-tag) { display: none; }
}
```

---

## 9. Hero Section Pattern

### Case Study Hero

```html
<section class="hero" style="padding-top: 120px; border-top: none;">
  <div class="hero-bg"></div>

  <!-- Optional decorative SVG/icon (top-right, absolute) -->

  <div class="hero-eyebrow">
    <span>Role · Platform · Type</span>
  </div>

  <h1 class="hero-title">
    <span class="line1">Word One</span>
    <span class="line2">Word Two</span>         <!-- gradient purple text -->
    <span class="line3">a tagline phrase.</span><!-- Fraunces italic, dim -->
  </h1>

  <p class="hero-subtitle">Short 1–2 sentence description of the project.</p>

  <div class="hero-meta">
    <div class="hero-meta-item"><div class="meta-label">Role</div><div class="meta-val">…</div></div>
    <div class="hero-meta-item"><div class="meta-label">Platform</div><div class="meta-val">…</div></div>
    <div class="hero-meta-item"><div class="meta-label">Type</div><div class="meta-val">…</div></div>
    <div class="hero-meta-item"><div class="meta-label">Year</div><div class="meta-val">…</div></div>
  </div>

  <div class="scroll-hint">Scroll to explore</div>
</section>
```

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 48px 80px;
  position: relative;
  overflow: hidden;
}

.hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 65% 60% at 5% 55%, rgba(124, 58, 237, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 95% 15%, rgba(168, 85, 247, 0.06) 0%, transparent 55%);
}

.hero-eyebrow {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 32px; position: relative; z-index: 1;
  animation: fadeUp 0.7s 0.05s ease both;
}
.hero-eyebrow::before { content: ''; width: 48px; height: 1px; background: var(--purple-bright); }
.hero-eyebrow span { font-size: 11px; letter-spacing: 0.2em; color: var(--purple-bright); text-transform: uppercase; }

.hero-title {
  position: relative; z-index: 1;
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(40px, 9vw, 118px);
  line-height: 0.92; letter-spacing: -0.03em; margin-bottom: 32px;
}
.hero-title .line1 { display: block; color: var(--white); animation: fadeUp 0.7s 0.12s ease both; }
.hero-title .line2 {
  display: block;
  background: linear-gradient(135deg, var(--purple-bright) 0%, #c084fc 50%, var(--purple-bright) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: fadeUp 0.7s 0.22s ease both;
}
.hero-title .line3 {
  display: block; color: var(--text-dim);
  font-family: 'Fraunces', serif; font-weight: 300; font-style: italic;
  animation: fadeUp 0.7s 0.32s ease both;
}

.hero-subtitle {
  position: relative; z-index: 1;
  font-family: 'Fraunces', serif; font-weight: 300; font-style: italic;
  font-size: 20px; color: var(--text-muted);
  max-width: 580px; margin-bottom: 48px;
  animation: fadeUp 0.7s 0.4s ease both;
}

.hero-meta {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--line); padding-top: 40px;
  animation: fadeUp 0.7s 0.5s ease both;
}
.hero-meta-item { padding-right: 32px; border-right: 1px solid var(--line); }
.hero-meta-item:last-child { border-right: none; }
.hero-meta-item:not(:first-child) { padding-left: 32px; }
.meta-label { font-size: 10px; letter-spacing: 0.2em; color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px; }
.meta-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--white); }

.scroll-hint {
  position: relative; z-index: 1;
  font-size: 11px; letter-spacing: 0.15em; color: var(--text-dim);
  text-transform: uppercase; margin-top: 32px;
  display: flex; align-items: center; gap: 10px;
  animation: fadeUp 0.7s 0.6s ease both;
}
.scroll-hint::after { content: '↓'; color: var(--purple-bright); }

/* Responsive */
@media (max-width: 900px) {
  .hero-meta { grid-template-columns: 1fr 1fr; gap: 20px; }
  .hero-meta-item { border-right: none; padding: 0; }
}
@media (max-width: 600px) {
  .hero-title { font-size: clamp(36px, 10vw, 64px); }
  .hero-subtitle { font-size: 16px; margin-bottom: 32px; }
  .hero-meta { grid-template-columns: 1fr 1fr; gap: 16px; }
}
```

---

## 10. Section Label Pattern

Every case study section starts with this exact label above the title:

```html
<div class="section-label reveal">
  <span class="sl-text">Section Name</span>
  <span class="sl-num">/ 01</span>
</div>
<div class="section-title reveal">Headline text here.</div>
<p class="section-sub reveal">One-liner italic description.</p>
```

```css
.section-label {
  display: flex; align-items: center; gap: 14px; margin-bottom: 56px;
}
.section-label::before { content: ''; width: 24px; height: 1px; background: var(--purple); }
.sl-text { font-size: 10px; letter-spacing: 0.25em; color: var(--purple-bright); text-transform: uppercase; }
.sl-num  { font-size: 10px; color: var(--text-dim); letter-spacing: 0.2em; }

.section-title {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: clamp(28px, 5vw, 52px);
  line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 20px;
}

.section-sub {
  font-family: 'Fraunces', serif; font-weight: 300; font-style: italic;
  font-size: 20px; color: var(--text-muted); margin-bottom: 56px; max-width: 540px;
}

/* Mobile ≤600px */
@media (max-width: 600px) {
  .section-label { margin-bottom: 32px; }
  .section-title { font-size: clamp(26px, 8vw, 36px); }
  .section-sub   { font-size: 16px; margin-bottom: 32px; }
}
```

> **Rule:** Increment `/ 01`, `/ 02`, `/ 03` … for each section in order.

---

## 11. Two-Column Layout Pattern

The standard split used for platform overviews, problem statements, roles, research, and comparisons:

```html
<div class="THING-grid">
  <div class="THING-left">
    <!-- Primary content: description, list, stat -->
  </div>
  <div class="THING-right">
    <!-- Secondary content: cards, visuals, checklist -->
  </div>
</div>
```

```css
.THING-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }

.THING-left  { padding-right: 80px; border-right: 1px solid var(--line); }
.THING-right { padding-left: 80px; display: flex; flex-direction: column; justify-content: center; }

/* Tablet ≤1024px: stack */
@media (max-width: 1024px) {
  .THING-grid { grid-template-columns: 1fr; }
  .THING-left  { padding-right: 0; border-right: none; border-bottom: 1px solid var(--line); padding-bottom: 48px; margin-bottom: 48px; }
  .THING-right { padding-left: 0; }
}

/* Mobile ≤768px: stays stacked, clean up borders */
@media (max-width: 768px) {
  .THING-left  { padding-right: 0; border-bottom: 1px solid var(--line); padding-bottom: 40px; margin-bottom: 0; }
  .THING-right { padding-left: 0; }
}

/* Small mobile ≤600px: remove all padding/borders */
@media (max-width: 600px) {
  .THING-left, .THING-right { padding: 0 !important; border: none !important; }
}
```

---

## 12. Decision / Content Card Pattern

Used for design decisions, key insights, and feature breakdowns:

```html
<div class="decision-card reveal">
  <div class="decision-meta">
    <div class="decision-number">01</div>
    <div class="decision-tag">Tag label</div>
  </div>
  <div class="decision-body">
    <div class="decision-headline">The decision headline text</div>
    <p class="decision-text">Explanation paragraph...</p>
    <!-- Optional: before/after, image, list -->
  </div>
</div>
```

```css
.decision-card {
  border-top: 1px solid var(--line);
  padding: 64px 0;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 80px;
  align-items: start;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.decision-card.visible { opacity: 1; transform: translateY(0); }

.decision-number {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: 72px; line-height: 1; letter-spacing: -0.04em; color: var(--text-dim);
}

.decision-headline {
  font-family: 'Syne', sans-serif; font-weight: 700;
  font-size: 24px; letter-spacing: -0.01em; margin-bottom: 16px; color: var(--white);
}

/* Tablet ≤900px */
@media (max-width: 900px) {
  .decision-card { grid-template-columns: 1fr; gap: 32px; }
  .decision-meta { position: relative; top: 0; }
}

/* Small mobile ≤600px */
@media (max-width: 600px) {
  .decision-card { padding: 40px 0; }
  .decision-number { font-size: 48px; }
  .decision-headline { font-size: 20px; }
}
```

---

## 13. Scroll Reveal Animations

Every section's main content blocks use the `.reveal` class. JavaScript observes them and adds `.visible` when they enter the viewport.

### HTML usage

```html
<div class="section-label reveal">…</div>
<div class="section-title reveal">…</div>
<p class="section-sub reveal">…</p>
<div class="my-grid reveal">…</div>
```

### CSS

```css
/* Global pages (styles.css) */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity, transform;
}
.reveal--visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Stagger delays (add to children inside a .reveal block) */
.reveal--delay-1 { transition-delay: 0.1s; }
.reveal--delay-2 { transition-delay: 0.2s; }
.reveal--delay-3 { transition-delay: 0.3s; }
```

```css
/* Case study pages — same idea, uses .visible class */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### JavaScript (copy into every new case study `<script>` block)

```javascript
// Scroll reveal
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

> For global pages, replace `.visible` with `--visible` to match the `styles.css` class name `.reveal--visible`.

---

## 14. Keyframe Animations

### Hero entrance animation (used in case study pages)

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Usage: `animation: fadeUp 0.7s 0.12s ease both;` (second value = delay)

### Global page hero entrance (styles.css)

```css
@keyframes revealUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes revealFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Staggered delays on home hero */
.hero__headline .dim  { animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.1s; }
.hero__headline .bright { animation-delay: 0.2s; }
.hero__subline          { animation-delay: 0.35s; }
.hero__cta              { animation-delay: 0.5s; }
.hero__image-wrapper    { animation: revealFade 1.2s ease forwards; animation-delay: 0.4s; }
```

---

## 15. Hover & Transition Rules

### Standard easing function

```css
/* All interactive elements */
transition: all 0.2s ease;                /* quick, subtle */
transition: all 0.3s ease;                /* medium interactions */
transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);  /* smooth premium lift */
transition: opacity 0.55s ease, transform 0.55s ease;  /* scroll reveals */
```

### Card hover lift

```css
/* Project cards, nav cards */
.project-card:hover,
.nav-project-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.1);
}

/* Specialization cards */
.specialization-card:hover {
  border-color: var(--violet);
  transform: translateY(-2px);
}

/* Buttons */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(124, 58, 237, 0.15);
}

/* Metric cards */
.metric-card:hover {
  background-color: var(--bg3);
  transform: translateY(-4px);
}

/* Small list items (case studies) */
.benefit-item:hover,
.insight-card:hover,
.role-focus-item:hover {
  background: var(--bg4);
  border-color: var(--line-purple);
}
```

### Left-border grow on specialization cards

```css
.specialization-card::before {
  content: ''; position: absolute;
  top: 0; left: 0; width: 3px; height: 0;
  background: var(--violet); transition: height 0.3s ease;
}
.specialization-card:hover::before { height: 100%; }
```

---

## 16. Noise Texture Overlay

Apply to every page's `body::before` to give it the premium grain texture:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1000;
  opacity: 0.55;
}
```

---

## 17. Project Navigation Footer

Every case study ends with a two-card project navigation section that links to other case studies:

```html
<div class="project-nav-section">
  <div class="project-nav-grid">
    <a href="previous-case-study.html" class="nav-project-card">
      <div class="nav-project-label">← Previous Project</div>
      <div class="nav-project-title">Project Name</div>
      <div class="nav-project-btn">View Case Study →</div>
    </a>
    <a href="next-case-study.html" class="nav-project-card">
      <div class="nav-project-label">Next Project →</div>
      <div class="nav-project-title">Project Name</div>
      <div class="nav-project-btn">View Case Study →</div>
    </a>
  </div>
</div>
```

```css
.project-nav-section {
  padding: 120px 48px;
  background: var(--bg2);
  border-top: 1px solid var(--line);
}

.project-nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-project-card {
  text-align: center; padding: 48px;
  border: 1px solid var(--line); border-radius: 4px;
  transition: all 0.3s ease; text-decoration: none;
  display: flex; flex-direction: column; align-items: center;
}
.nav-project-card:hover {
  background: var(--bg3); border-color: var(--purple-bright); transform: translateY(-4px);
}
.nav-project-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 16px; }
.nav-project-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: -0.02em; margin-bottom: 24px; color: var(--text); }
.nav-project-btn   { display: inline-flex; align-items: center; gap: 12px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--purple-bright); }

/* Mobile ≤768px */
@media (max-width: 768px) {
  .project-nav-grid { grid-template-columns: 1fr; }
  .project-nav-section { padding: 80px 24px; }
}
```

---

## 18. Case Study Page Structure Checklist

When building a new case study, go through this list in order:

- [ ] `<!DOCTYPE html>` + `<meta charset="UTF-8">` + `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] `<title>Project Name — Case Study</title>`
- [ ] Google Fonts `<link>` (exact string from Section 5)
- [ ] `:root` color tokens (copy from Section 6 — Case Study tokens)
- [ ] `body::before` noise texture (Section 16)
- [ ] `body` base styles: `font-family: 'DM Mono'`, `font-size: 14px`, `line-height: 1.7`, `overflow-x: hidden`
- [ ] Fixed `nav` with logo, meta, tag, theme toggle (Section 8)
- [ ] Hero `<section>` with `padding-top: 120px` (Section 9)
- [ ] All content sections with `<section>` + `border-top: 1px solid var(--line)`
- [ ] Alternating section backgrounds: `odd → var(--bg)`, `even → var(--bg2)`
- [ ] Section label + title + sub on every section (Section 10)
- [ ] `.reveal` class on all main content blocks + IntersectionObserver JS (Section 13)
- [ ] Decision cards with `.visible` trigger (Section 12)
- [ ] Project navigation footer (Section 17)
- [ ] Footer with brand name + meta, `flex-direction: column` at ≤900px
- [ ] All responsive `@media` blocks in order: `min-width: 1600px`, `max-width: 1024px`, `max-width: 900px`, `max-width: 768px`, `max-width: 600px`
- [ ] Theme toggle JS (copy from any existing case study)

---

## 19. Quick-Copy Boilerplate

### New Case Study — Minimal HTML Shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PROJECT NAME — Case Study</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #080808; --bg2: #0f0f0f; --bg3: #161616; --bg4: #1c1c1c;
      --purple: #7c3aed; --purple-bright: #a855f7; --purple-dim: #3b0764;
      --purple-glow: rgba(124, 58, 237, 0.13);
      --white: #ffffff; --text: #f5f5f5; --text-muted: #888888; --text-dim: #444444;
      --line: rgba(255, 255, 255, 0.07); --line-purple: rgba(124, 58, 237, 0.2);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: 'DM Mono', monospace; font-size: 14px; line-height: 1.7; overflow-x: hidden; }
    body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 1000; opacity: 0.55; }

    /* ── NAV ── */
    nav { position: fixed; top: 0; left: 0; right: 0; z-index: 900; display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; background: rgba(8,8,8,0.88); backdrop-filter: blur(24px); border-bottom: 1px solid var(--line); }
    .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 0.15em; color: var(--purple-bright); text-transform: uppercase; text-decoration: none; }
    .nav-meta { display: flex; gap: 32px; align-items: center; }
    .nav-meta span { font-size: 11px; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; }
    .nav-tag { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; background: var(--purple-dim); color: var(--purple-bright); padding: 4px 10px; border-radius: 2px; border: 1px solid var(--purple); }

    /* ── SECTIONS ── */
    section { padding: 112px 48px; border-top: 1px solid var(--line); }
    section:nth-child(odd)  { background: var(--bg); }
    section:nth-child(even) { background: var(--bg2); }

    /* ── SECTION LABEL ── */
    .section-label { display: flex; align-items: center; gap: 14px; margin-bottom: 56px; }
    .section-label::before { content: ''; width: 24px; height: 1px; background: var(--purple); }
    .sl-text { font-size: 10px; letter-spacing: 0.25em; color: var(--purple-bright); text-transform: uppercase; }
    .sl-num  { font-size: 10px; color: var(--text-dim); letter-spacing: 0.2em; }
    .section-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(28px, 5vw, 52px); line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 20px; }
    .section-sub   { font-family: 'Fraunces', serif; font-weight: 300; font-style: italic; font-size: 20px; color: var(--text-muted); margin-bottom: 56px; max-width: 540px; }

    /* ── REVEAL ── */
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* ── PROJECT NAV ── */
    .project-nav-section { padding: 120px 48px; background: var(--bg2); border-top: 1px solid var(--line); }
    .project-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 1200px; margin: 0 auto; }
    .nav-project-card { text-align: center; padding: 48px; border: 1px solid var(--line); border-radius: 4px; transition: all 0.3s ease; text-decoration: none; display: flex; flex-direction: column; align-items: center; }
    .nav-project-card:hover { background: var(--bg3); border-color: var(--purple-bright); transform: translateY(-4px); }
    .nav-project-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 16px; }
    .nav-project-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: -0.02em; margin-bottom: 24px; color: var(--text); }
    .nav-project-btn   { display: inline-flex; align-items: center; gap: 12px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--purple-bright); }

    /* ── RESPONSIVE ── */
    @media (min-width: 1600px) {
      nav { padding: 20px 80px; }
      section { padding: 120px 80px; }
    }
    @media (max-width: 1024px) {
      /* Stack two-column grids → single column */
    }
    @media (max-width: 900px) {
      nav { padding: 16px 24px; }
      section { padding: 72px 24px; }
    }
    @media (max-width: 768px) {
      .project-nav-grid { grid-template-columns: 1fr; }
      .project-nav-section { padding: 80px 24px; }
    }
    @media (max-width: 600px) {
      .nav-meta span:not(.nav-tag) { display: none; }
      section { padding: 60px 16px; }
      .section-title { font-size: clamp(26px, 8vw, 36px); }
      .section-sub   { font-size: 16px; margin-bottom: 32px; }
    }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav>
    <a href="index.html" class="nav-logo">PROJECT NAME</a>
    <div class="nav-meta">
      <a href="index.html" style="font-size:11px;letter-spacing:0.1em;color:var(--text-muted);text-transform:uppercase;text-decoration:none;" onmouseover="this.style.color='var(--purple-bright)'" onmouseout="this.style.color='var(--text-muted)'">Home</a>
      <span>Context · Type · Category</span>
      <span class="nav-tag">Case Study · 2025</span>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero" style="padding-top:120px; border-top:none;">
    <div class="hero-bg"></div>
    <div class="hero-eyebrow"><span>Role · Platform · Type</span></div>
    <h1 class="hero-title">
      <span class="line1">Word One</span>
      <span class="line2">Word Two</span>
      <span class="line3">a tagline.</span>
    </h1>
    <p class="hero-subtitle">Short project description.</p>
    <div class="hero-meta">
      <div class="hero-meta-item"><div class="meta-label">Role</div><div class="meta-val">…</div></div>
      <div class="hero-meta-item"><div class="meta-label">Platform</div><div class="meta-val">…</div></div>
      <div class="hero-meta-item"><div class="meta-label">Type</div><div class="meta-val">…</div></div>
      <div class="hero-meta-item"><div class="meta-label">Year</div><div class="meta-val">2025</div></div>
    </div>
    <div class="scroll-hint">Scroll to explore</div>
  </section>

  <!-- SECTION 01 -->
  <section>
    <div class="section-label reveal"><span class="sl-text">Section Name</span><span class="sl-num">/ 01</span></div>
    <div class="section-title reveal">Section headline.</div>
    <p class="section-sub reveal">Section one-liner.</p>
    <!-- content -->
  </section>

  <!-- PROJECT NAV FOOTER -->
  <div class="project-nav-section">
    <div class="project-nav-grid">
      <a href="prev.html" class="nav-project-card">
        <div class="nav-project-label">← Previous Project</div>
        <div class="nav-project-title">Previous Name</div>
        <div class="nav-project-btn">View Case Study →</div>
      </a>
      <a href="next.html" class="nav-project-card">
        <div class="nav-project-label">Next Project →</div>
        <div class="nav-project-title">Next Name</div>
        <div class="nav-project-btn">View Case Study →</div>
      </a>
    </div>
  </div>

  <script>
    // Scroll reveal
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
  </script>
</body>
</html>
```

---

## 20. Zenisth Design System Showcase (Standalone Template)

The `Zenisth_DS.html` case study operates as a standalone template with its own isolated design system, deviating from the main portfolio's variables.

### Typography
- **Primary Display**: `'Nunito', sans-serif` (Headings, Logos)
- **Primary Sans**: `'Nunito Sans', sans-serif` (Body text)
- **Monospace**: `'Roboto Mono', monospace` (Tags, labels, code snippets)

### Breakpoints & Layouts
Unlike the rest of the portfolio, the Zenisth DS showcase relies on a single overarching media query:
```css
/* Tablet & Mobile ≤900px */
@media (max-width: 900px) {
  nav { padding: 0 24px; }
  .nav-links { display: none; }
  .hero, .section-wrapper, .ai-section, footer, .chapter-banner { padding-left: 24px; padding-right: 24px; }
  .hero { padding-top: 100px; }
  /* All grids stack to single column */
  .chaos-grid, .token-arch, .reflection-grid, .dark-theme-showcase, .principles-grid { grid-template-columns: 1fr; }
  .states-grid, .outcome-row { grid-template-columns: repeat(2, 1fr); }
  .ai-pipeline { flex-direction: column; }
  footer { flex-direction: column; gap: 16px; text-align: center; }
}
```

### Color Tokens (Zenisth DS Specific)
```css
:root {
  --brand: #5A46C7;
  --brand-light: #7B6BD4;
  --bg: #06060A;
  --bg-2: #0D0D14;
  --bg-3: #12121C;
  --text: #F0EFF8;
  --text-2: #A09CB8;
  --text-3: #5E5A78;
}
```

### Unique Patterns
- **`.chapter-banner`**: A full-width banner separating major sections (`#0D0D14` background, bordered top and bottom).
- **`.chaos-grid` & `.token-arch`**: Custom flex/grid components specific to the system documentation.
- **Scroll Reveal**: Uses `.reveal` and `.reveal.visible` similar to standard case studies, but transforms `32px` up instead of `24px`.

---

*Last updated: June 2026. Extracted from: `styles.css`, `rumble-rewards-case-study.html`, `trailtribe-case-study.html`, `transify-case-study.html`, `idp-case-study.html`, `index.html`, `about.html`, `contact.html`, `Zenisth_DS.html`.*
