# 05_BUILD_FOR_AGENCIES_PAGE.md
# Build the full /for-agencies marketing page.
# ReliantCareNetwork — For Agencies Page

---

## Pre-flight

Read before writing any code:
- 00_AGENT_INSTRUCTIONS.md
- 02_DESIGN_SYSTEM.md

One file only:
```
app/for-agencies/page.tsx
```

Tone: efficient, confident, data-driven.
Audience: care agency owners and recruiters.
Pain: high turnover, hiring blind, no real candidate data.

---

## Page Structure — 7 Sections

```
1. Hero
2. What every profile contains
3. How it works
4. Why ReliantCare vs general job boards
5. Platform pillars
6. Pricing placeholder + email capture
7. Final CTA band
```

---

## Section 1 — Hero

Background: #0D1B3E with gradient overlay
Photo overlay: 8% opacity, business/planning context

Eyebrow: "For care agencies · Verified recruiting"

Headline line 1 (white, font-black):
"Real profiles. Real data."

Headline line 2 (gold #C9973A, font-black):
"No more hiring on gut feel."

Both lines same size (text-5xl), same weight (font-black), NOT italic.

Sub: "Search, compare and shortlist verified caregivers —
comprehensive profiles, trust scores and intelligent insights
that take the guesswork out of every hire."

CTA Primary (royal blue gradient):
"Start your agency account →" → /sign-up?role=agency

CTA Secondary (ghost):
"See how it works" → scrolls to #how-it-works

Trust note below CTAs (small, white/50):
"Every caregiver profile is scored, verified and admin-approved
before it appears in your search results."

---

## Section 2 — What Every Profile Contains

Background: #0D1B3E (continues from hero)
Heading (white): "What every profile contains"
Sub (white/50): "Before you open a single profile, the work is already done."

Four badge rows (dark glass cards):
1. ShieldCheck (emerald) — Identity verified — Email · Phone · Documents
2. FileCheck (blue) — Credentials reviewed — CPR · PSW · Certifications
3. Users (amber) — References provided — Verified employer contacts
4. BadgeCheck (purple) — Admin approved — Profile live and searchable

Trust score bar below:
Label: "Profile trust score"
Bar: gold gradient, 87% filled

---

## Section 3 — How It Works

id="how-it-works"
Background: #F7F4F0

Heading: "Up and running in minutes"

4 steps — horizontal desktop, vertical mobile:
1. Create agency account — verified and admin-approved
2. Search verified talent pool — filter by specialty, certs, location
3. Compare and shortlist — side by side, private notes, status tags
4. Reach out and hire — contact details unlocked for shortlisted

Step number badges: royal blue gradient circle with white number

Trust note below (white card, centered):
ShieldCheck icon + "No profile searchable until reviewed
and approved. Every result has passed verification."

---

## Section 4 — Why ReliantCare

Background: #FDF6EC

Heading: "Why pay general job board prices for candidates
who aren't on general job boards?"

Sub: "General platforms serve every industry.
ReliantCare is built exclusively for care."

Comparison table:
Headers: Feature | General job boards | ReliantCare
ReliantCare column values: text-[#1E3A8A] font-semibold
General column values: text-[#94A3B8]

Rows:
| Candidate relevance | Every industry | 100% care-sector only |
| Credential verification | None — you chase it | Admin-reviewed before you see it |
| Search filters | Generic | Care-specific — specialty, certs, availability |
| Caregiver reputation | Resets every application | Verified, scored, multi-source |
| Competition for talent | Every employer | Care agencies only |
| Screening time | Weeks of manual work | Pre-screened — search, compare, done |

Never name competitors. Never show pricing.
Never use logos. Text only.

---

## Section 5 — Platform Pillars

Background: #F7F4F0

Heading: "From first hire to long-term retention"

4 cards:
1. Search icon (emerald) — Recruit
   Badge: "Available now" (green)
   Features: Verified search · Care-specific filters · Admin-verified credentials

2. GraduationCap (slate) — Train
   Badge: "Coming soon" (muted)
   opacity-60 grayscale
   Features: Role-based training · 250–550+ care materials · Shared training history

3. Heart (slate) — Retain
   Badge: "Coming soon" (muted)
   opacity-60 grayscale
   Features: Day 15/30/60/90 check-ins · At-risk identification · Manager tasks

4. Star (slate) — Recognize
   Badge: "Coming soon" (muted)
   opacity-60 grayscale
   Features: Review generation · Best of Home Care Awards · Employer brand tools

Active card (Recruit): border-[1.5px] border-[#C9973A]
Inactive cards: border-[#0D1B3E]/[0.07] opacity-45 grayscale

---

## Section 6 — Pricing Placeholder

Background: #0D1B3E
Centered layout

Heading (white):
"Simple, care-sector pricing.
Built for agencies of every size."

Body (white/50):
"We're finalising our plans for all agency sizes.
Join the early access list — founding members get
locked-in rates before public launch."

Email input + "Get early access pricing →" button (gold gradient)

Note below (white/25):
"Caregivers always join free — no plan needed."

Never show actual pricing figures.

---

## Section 7 — Final CTA Band

Background: linear-gradient(135deg, #0D1B3E, #1E3A8A)

Heading (white, font-black):
"Start building your verified talent pool today."

Sub (white/40):
"Verified candidates. Real data. No more hiring blind."

Button (gold gradient):
"Create your agency account →" → /sign-up?role=agency

---

## After Building

- [ ] Test at 320px, 768px, 1280px, 1440px
- [ ] Verify all 7 sections present
- [ ] Verify no pricing figures appear
- [ ] Verify no competitor names appear
- [ ] Verify #how-it-works scroll anchor works
- [ ] Verify CTA links go to correct routes

Commit:
```
feat: for-agencies page — full rebuild 7 sections
```

---

*Last updated: March 2026 — ReliantCareNetwork*
