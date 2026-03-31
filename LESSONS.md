# ReliantCare Network — Lessons Learned

---

## Project Overview

A two-sided caregiver trust and recruiting platform. Canada-first, US expansion. Franchise owner (Assisting Hands) + platform builder. Three user sides: caregivers, agencies, families.

**Stack:** React + Vite + Tailwind CSS + Framer Motion + Lucide Icons | Vercel (pending) | Supabase (pending)

---

## Design Decisions

### Color System
```
--bg:           #FAFAF8   (warm off-white — NOT pure white)
--bg-alt:       #F2F0EC   (slightly warmer for contrast sections)
--navy:         #1A2B4A   (deep navy — trust, authority)
--amber:        #F59E0B   (warm amber — energy, action)
--amber-light:  #FEF3C7   (soft amber for badges/highlights)
```
**Rationale:** Not cold medical blue. Not warm fuzzy. Editorial warmth. Professional but human.

### Typography
- Inter (Google Fonts) — 400/500/600/700/800 weights
- Single font family — weight creates hierarchy, no mixing
- Display sizes: 64px (desktop) down to 40px (mobile)

### Motion
- Fade-up entrance: opacity 0→1, translateY 24px→0, 500ms ease-out
- Stagger: 80ms between sibling elements
- Intersection Observer for scroll reveals (not Framer Motion — lighter)
- Accordion: max-height transition, 200ms
- No: bouncing, spinning, autoplay animations

---

## Component Architecture

### EmailForm — Reusable Component
Used in Hero and Final CTA. States: idle → loading → success → error.
```
Validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
Loading state: spinner button
Success state: replaces form with confirmation message
Error state: red border + inline message
```
Reusable via props: variant, buttonText, id

### Profile Card Visual
Static decorative card in SolutionSection. NOT functional — just shows what the real profile will look like. This is a marketing decision — the profile card is aspirational at this stage.

---

## JSX String Handling — CRITICAL LESSON

### The Apostrophe Problem
Strings containing apostrophes MUST use double quotes in JavaScript object literals:
```
❌  desc: 'You've been doing this...'
✅  desc: "You've been doing this..."
✅  {"You've been doing this..."}  (JSX expression)
```

This caused a full build failure (esbuild parse error) before it was caught.
**Rule:** In JSX, strings with apostrophes go inside `{}`. Template literals with backticks also work.

---

## Email Form — Submission Flow

Current (MVP, no backend):
```
User submits → validate client-side → fake 1s delay → success state
```
Production:
```
POST to /api/waitlist (Next.js route OR Supabase Edge Function)
→ Insert into Supabase "waitlist" table (email, timestamp, source)
→ Return 200
→ Update UI to success state
```

---

## What We Skipped (Per Lesson 1 — Free First)

| What | Why Skipped | When to Add |
|---|---|---|
| Supabase backend | No live URL yet | After Vercel deploy |
| Real email API | Free trial tokens needed | After waitlist grows |
| Analytics | Vercel has basic stats | When traffic picks up |
| Privacy policy page | Needed for trust — short doc | Before public launch |

---

## Deployment Status

### Current
- Dev server: running on `localhost:5173`
- Production build: ✅ `reliantcare/dist/` (verified working)

### Pending — Requires Romy's Action
1. Create GitHub repo for `reliantcare/`
2. Push code to GitHub
3. Go to vercel.com → Connect repo → Deploy (one click)

### Deploy Config Ready
- `vercel.json` — framework: vite, buildCommand, outputDirectory
- `index.html` — OG meta tags set
- `public/favicon.svg` — branded SVG favicon

---

## What to Add Next (Priority Order)

1. **Supabase backend** — waitlist table, real form submission
2. **Privacy Policy page** — simple one-pager, linked in footer
3. **Agency waitlist form** — separate form for agency side (different CTA)
4. **Analytics** — Vercel built-in (enable it) or Plausible (free, privacy-first)
5. **Caregiver portal** — the actual profile-building UI (after waitlist)

---

## Key Files

| File | Purpose |
|---|---|
| `SPEC.md` | Full design + copy spec |
| `LESSONS.md` | This file — project-specific lessons |
| `src/App.jsx` | All sections, full React app |
| `src/index.css` | Tailwind + custom scrollbar + reveal classes |

---

## What I (Sheldon Senior) Learned Building This

1. **The apostrophe issue** — JSX object strings with apostrophes fail silently or loudly. Use double quotes.
2. **Tailwind + Vite** — PostCSS config is required, not optional. Without it, Tailwind classes don't process.
3. **Lucide React icons** — clean, consistent, tree-shakeable. Better than heroicons for a production app.
4. **Intersection Observer is lighter than Framer Motion** — for scroll-triggered reveals, vanilla IO beats a full animation library.
5. **Vercel needs browser auth** — cannot deploy headlessly without a token. GitHub repo is the path.
6. **Nav scroll behavior** — tracked with `window.scrollY`, transitioned with CSS classes. `backdrop-filter` for the frosted glass effect.
7. **Stagger animations** — CSS `animation-delay` on child elements, not JS. Cleaner.
