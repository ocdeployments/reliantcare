# 02_DESIGN_SYSTEM.md
# Visual design rules. Apply to every file, every component.
# ReliantCareNetwork — Design System
# Colours reconciled: April 2026

---

## Colours — Single Source of Truth

These are the ONLY colours used across the entire platform.
Landing page and portal both use these values.
Never deviate. Never introduce one-off hex values.

```
Navy (primary dark):  #1A2B4A  — nav, hero, dark sections, headings
Navy dark:            #0F1E35  — footer, deepest backgrounds
Amber (primary CTA):  #F59E0B  — primary actions, caregiver accent, CTAs
Amber light:          #FCD34D  — amber hover states, gradients
Amber dark:           #B45309  — amber text on light backgrounds
Royal blue:           #1E3A8A  — agency accent
Royal light:          #2563EB  — agency hover, gradients
Warm white:           #FAFAF8  — page background
Gold tint:            #FEF3C7  — alternate light sections
Text primary:         #1A1A1A  — all body text
Text secondary:       #4B5563  — muted text
Text hint:            #9CA3AF  — placeholder, disabled
Border light:         rgba(26,43,74,0.08) — card borders
```

Family colour: #B45309 (amber dark)
Agency colour: #1E3A8A (royal blue)
Caregiver colour: #F59E0B (amber)

Never use green as primary.
Never use pure black (#000000) — use #1A1A1A.
Never use pure white (#ffffff) where warmth is needed — use #FAFAF8.

---

## Gradients

```css
/* Amber — caregiver, primary CTA */
background: linear-gradient(135deg, #F59E0B, #FCD34D);

/* Royal — agency */
background: linear-gradient(135deg, #1E3A8A, #2563EB);

/* Amber dark — family */
background: linear-gradient(135deg, #B45309, #D97706);

/* Dark CTA band */
background: linear-gradient(135deg, #1A2B4A 0%, #1E3A8A 100%);

/* Hero overlay */
background: linear-gradient(
  110deg,
  rgba(26,43,74,1) 0%,
  rgba(26,43,74,0.92) 45%,
  rgba(26,43,74,0.65) 100%
);
```

---

## Typography

```
Hero headline:    font-black, tracking-[-0.03em], leading-[1.0]
Section heading:  font-black, tracking-[-0.025em], leading-[1.1]
Card heading:     font-black, tracking-[-0.02em]
Eyebrow:          font-bold, tracking-[0.12em], uppercase, text-[10px]
Body:             text-[15px], leading-[1.65]
Small:            text-[13px], leading-[1.5]
```

Two font weights in UI: 400 regular, 700/800/900 bold.
Never use 600 weight.
Line length maximum 70 characters for body copy.
Minimum body text 15px — never smaller.

---

## Spacing

Use only multiples of 4px. No arbitrary values.

```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

Never use 7px, 13px, 22px or any non-multiple of 4.

---

## Cards

```css
border-radius: 16px;        /* rounded-2xl */
border: 0.5px solid rgba(26,43,74,0.08);
background: #ffffff;
box-shadow: 0 4px 24px rgba(0,0,0,0.06);

/* Hover */
box-shadow: 0 0 0 2.5px {brandColor},
            0 0 0 5px {brandColor}22,
            0 20px 50px {brandColor}30;
transform: translateY(-8px);
transition: all 0.25s ease-out;
```

---

## Buttons

```jsx
/* Primary — amber gradient */
className="text-[13px] font-bold px-6 py-3 rounded-xl
  text-white hover:opacity-90 transition-opacity"
style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
         color: '#1A1A1A' }}

/* Agency — royal blue */
className="text-[13px] font-bold px-6 py-3 rounded-xl
  text-white hover:opacity-90 transition-opacity"
style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)' }}

/* Ghost — dark bg */
className="text-[13px] font-bold px-6 py-3 rounded-xl
  text-white/70 bg-white/[0.05] border border-white/[0.12]
  hover:bg-white/[0.08] transition-all"

/* Ghost — light bg */
className="text-[13px] font-bold px-6 py-3 rounded-xl
  text-[#1A2B4A] border border-[#1A2B4A]/20
  hover:bg-[#1A2B4A]/5 transition-all"
```

---

## Form Inputs

```jsx
className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB]
  bg-white text-[14px] text-[#1A1A1A] placeholder-[#9CA3AF]
  focus:outline-none focus:border-[#F59E0B]
  focus:ring-1 focus:ring-[#F59E0B]/20
  transition-colors"
```

Labels: always visible, never placeholder-only.
Required fields: marked clearly.
Validation: helpful messages, not just "invalid".
Phone: (XXX) XXX-XXXX format enforced.
Email: validated.
Postal: 5-digit US or 6-char Canadian.

---

## Section Alternation

```
#FAFAF8 (warm white)
→ #1A2B4A (navy)
→ #FEF3C7 (amber tint)
→ #1A2B4A (navy)
→ footer: #0F1E35
```

Never two dark sections back to back.
Never two identical light sections back to back.

---

## Interactive States

Every interactive element needs all states:

| State | Treatment |
|-------|-----------|
| Default | Clear affordance — looks clickable |
| Hover | Colour shift or -8px lift, 200ms ease-out |
| Active | scale(0.98), slight darken |
| Focus | 2px solid #F59E0B outline, 2px offset |
| Disabled | opacity-40, cursor-not-allowed |
| Loading | Spinner or skeleton — never frozen UI |

Animations: transform and opacity only.
Always wrap in prefers-reduced-motion.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

Test at all of these before marking any UI task done:

| Width | Device |
|-------|--------|
| 320px | iPhone SE — minimum |
| 375px | iPhone 14 |
| 768px | iPad portrait |
| 1024px | iPad landscape |
| 1280px | Standard desktop |
| 1440px | Large desktop |

Mobile first. 320px baseline. Then sm → md → lg → xl.

---

## Icons

lucide-react only. No emojis anywhere.
Icon size in nav/buttons: w-4 h-4
Icon size in cards: w-5 h-5
Icon size in features/heroes: w-6 h-6
Never inherit icon size from parent — always explicit.

---

## Photography

Non-medical caregivers in everyday home settings.
No medical equipment, uniforms, or hospital settings.
Hero overlays: 8% opacity on dark backgrounds.
Always use next/image — never raw img tags.
Always define aspect ratios — no layout shift.

---

## What Never Appears

- Emojis — lucide-react icons only
- Green as primary colour
- Pricing figures
- Competitor names
- "Welcome" in any heading
- Session UI on public pages
- Medical-only imagery (stethoscopes, hospital beds)
- Pure black (#000000)
- Hardcoded colours outside this file

---

## Tailwind Config Tokens

Add to tailwind.config.js:

```javascript
colors: {
  navy: {
    DEFAULT: '#1A2B4A',
    dark: '#0F1E35',
  },
  amber: {
    DEFAULT: '#F59E0B',
    light: '#FCD34D',
    dark: '#B45309',
    tint: '#FEF3C7',
  },
  royal: {
    DEFAULT: '#1E3A8A',
    light: '#2563EB',
  },
  warm: {
    white: '#FAFAF8',
  }
}
```

---

*Last updated: April 2026 — ReliantCareNetwork*
*Colours reconciled between landing page and portal.*
*This file is the single source of truth. Trust it over all others.*
