# ReliantCare Network — Project Memory

> Last updated: 2026-03-30
> Read this before every session. This is the authoritative source of truth for this project.

---

## The Vision

**ReliantCare Network** is a three-sided trust and recruiting platform for the home caregiving industry. Not a job board. Not another agency SaaS. The first portable, cross-agency reputation system built specifically for caregivers.

### The Core Problem Being Solved

The caregiving industry runs on gut feel and blind hiring. Caregivers lose their reputation every time they change employers — starting from zero with every new agency. Agencies hire without real data and lose good people in the first 90 days. Families have no trusted way to find vetted care. There is no infrastructure for trust.

### The Solution

A platform where:
- **Caregivers** build one verified, portable profile — credentials, work history, reliability score, care ratings — uploaded once, owned forever, shared with every agency
- **Agencies** search and recruit from pre-verified, scored caregivers. Real data, not self-reported. AI recruiting agent handles screening and scheduling
- **Families** submit a short intake form and get matched with verified local agencies. Two-sided ratings visible — agency AND caregiver

### The Franchise Connection

Romy is buying an **Assisting Hands** franchise in Texas (before August 2026). ReliantCare Network is a **separate business** — owned by Romy, complementary to the franchise.

- ReliantCare is the platform/technology business
- Assisting Hands franchise is the operating agency
- The franchise becomes the **anchor customer and data source** — proof the platform works
- When pitching other agencies: "I built this because I was running an agency and needed it"

---

## The Three Products

### 1. ReliantCare Network (Core — The Trust Infrastructure)
- Portable caregiver profiles
- Two-sided ratings: agency rates caregiver (high weight) + family rates caregiver (medium weight)
- Reply mechanism: caregiver can respond to agency ratings — two-sided story, not one-sided
- Credential vault: uploaded once, verified by agencies
- Reliability score: shift completion rate, no-show frequency, care quality
- Free for caregivers forever

### 2. ReliantCare Recruit (Agency Tool — The AI Recruiting Agent)
- Voice + SMS automated screening conversations
- Configurable screening questions per agency
- Interview scheduling with calendar sync
- Re-engagement and nurture campaigns
- Reduces 70%+ of agency recruiting time
- Integrates with ReliantCare profiles — screens against verified history

### 3. Family Matching (Demand Side — Later Phase)
- Short intake form
- Matched with verified local agencies
- Agency ratings visible to families
- Simple, private, guided

---

## The Monetization Model

**Caregivers: Free forever**
- Pulls the supply side in — no barrier to entry
- Competitor platforms (CareLinx, Caring Support) charge or restrict caregivers

**Agencies: Freemium**
- Free tier: basic profile viewing, limited searches
- Paid tier: full recruiting agent, advanced filters, unlimited screening, scheduling automation
- Estimated: $100-300/month per agency

**Monetization approach:** Standard two-sided marketplace pattern — most successful marketplaces monetize from one side only. Agencies are the paying side.

---

## The Data Moat

The two-sided verified reputation system is the core moat:
- Reputations are earned through real work
- Verified by multiple independent sources: agencies, families, platform admin
- Not portable from elsewhere — built here, owned here
- Reply mechanism makes it credible and non-gaming
- Over time, a caregiver's score is undeniable — backed by 3-5 agency confirmations

---

## The Chicken-and-Egg Problem

**The standard problem:** Caregivers won't join without agencies. Agencies won't pay without caregivers.

**The ReliantCare solution:**
1. Build caregiver waitlist first (pure marketing, no platform needed)
2. Romy's Assisting Hands franchise launches → generates real shift data from day 1
3. Franchise IS the first agency → provides critical mass of data
4. Platform pitch to other agencies: "This is how we run our own agency. Here's the actual data."
5. Other agencies join because Romy has proof, not just a pitch

---

## Competitive Landscape

| Platform | What They Do | ReliantCare Difference |
|---|---|---|
| Caring Support (Canada) | Job board, profile builder | No portable reputation, no two-sided ratings |
| CareLinx (US) | Agency replacement — families hire CareLinx directly | Not portable, single-company model |
| Activated Insights Recruit | AI recruiting agent for agencies | No caregiver profile/reputation layer |
| HomeCareGPT / Sage | Intake automation for agencies | No trust infrastructure |
| Honor, Visiting Angels | Traditional agencies | No portable reputation system |

**The gap no one has filled:** Portable cross-agency caregiver reputation with two-sided ratings and reply mechanism.

---

## The Market Data

- **60-75%** annual caregiver turnover rate (US data — Canada comparable)
- **$2,600–$5,000** cost to replace one caregiver
- **50%** of scheduled interviews are no-shows
- **3-6 weeks** average time-to-hire in home care
- **73%** of caregivers say application process affects job acceptance
- Word-of-mouth hires → 59% turnover, $520 acquisition cost
- 7.8 million direct care jobs projected to be open by 2026 (US)
- 63% of PSWs in Canada left/considered leaving in 2 years (CSA Group, June 2025)
- 72% of PSWs experience burnout monthly or more
- 86% of PSWs satisfied with nature of work — they hate the system, not the job

---

## The Brand

**Name:** ReliantCare Network
**Tagline:** Don't start from zero again.
**Domain:** reliantcare.com (or .network)
**Feel:** Clear, confident, human. Editorial warmth. Not corporate, not warm-and-fuzzy.

### Voice
- Direct. Respectful. Like a smart colleague who gets it.
- Plain English. Short sentences. Active voice.
- No "ecosystem." No "journey." No "empower."
- Speaks to the specific pain — caregivers starting from zero every time they switch

### Color Palette
```
Background:     #FAFAF8  (warm off-white)
Background Alt: #F2F0EC  (warm gray)
Navy:           #1A2B4A  (deep — trust, authority)
Amber:          #F59E0B  (warm — energy, action)
Amber Light:    #FEF3C7  (soft — badges, highlights)
Text:           #1A1A1A  (near-black)
Text Muted:     #6B7280  (secondary)
Border:         #E5E5E3  (subtle)
```

### Typography
- Inter (Google Fonts) — 400/500/600/700/800
- Single family — weight creates hierarchy

---

## The Tech Stack

### Current (Built)
- React 18 + Vite
- Tailwind CSS + PostCSS
- Lucide React (icons)
- Intersection Observer (scroll reveals)
- Google Fonts (Inter)

### Pending
- Supabase — database, auth, edge functions
- Vercel — hosting
- GitHub — code repository
- Twilio — SMS + voice for recruiting agent
- OpenAI API — AI brain for recruiting agent

---

## The Phased Build Plan

### Phase 0 — Waitlist (RIGHT NOW — Free)
- Landing page ✅ BUILT
- Caregiver waitlist form ✅ BUILT
- Agency stats section ✅ BUILT
- Privacy policy page (pending)
- Analytics (pending)
- Push to GitHub, deploy Vercel (needs Romy action)

**Goal:** 500 caregiver emails before building anything else

### Phase 1 — Caregiver Portal (After Vercel Deploy)
- Full caregiver signup + profile builder
- Credential upload (PSW cert, CPR, TB test, vulnerable sector)
- Profile view with reliability score
- Supabase backend: waitlist table, caregiver profiles table
- Agency portal: search caregivers, view profiles

**Goal:** 50 caregiver profiles live with real-ish data

### Phase 2 — Agency Portal + Two-Sided Ratings
- Agency dashboard: search, filter, view full caregiver history
- Agency posts ratings: shift completion, no-shows, care quality
- Caregiver responds to ratings (reply mechanism)
- Family rating (after agency + caregiver both rate)
- Reliability score algorithm

**Goal:** 5-10 agency pilots (hand-to-hand onboarding)

### Phase 3 — AI Recruiting Agent
- Twilio setup (SMS + voice)
- Screening conversation flow (LLM-powered)
- Interview scheduling with Google Calendar API
- Agency dashboard: view screened candidates, schedule
- Integration with ReliantCare profiles — screen against verified history

**Goal:** One agency using the full recruiting agent

### Phase 4 — Family Matching
- Family intake form
- Match algorithm: location + care type + availability
- Family rates agency after service
- Agency rating visible to future families

**Goal:** Families getting matched, first reviews live

### Phase 5 — US Expansion (Texas Franchise Launch)
- Assisting Hands franchise goes live → generates first real data
- ReliantCare platform used by the franchise on day 1
- Texas data used as proof of concept for other agencies
- Recruit other Assisting Hands franchisees to join platform

### Phase 6 — Scale
- Canada full launch (Ontario first, then BC, AB)
- US expansion through Assisting Hands franchise network
- Monetization: agency subscription tiers

---

## Key Decisions Made

| Decision | Rationale |
|---|---|
| Canada first, not Texas first | No geographic constraint needed — simplifies |
| Caregivers free forever | Supply-side magnet, competitor platforms restrict |
| Two-sided ratings with reply | Makes scores credible, prevents gaming |
| Agency-weighted scoring | Agencies have shift data — higher quality signal |
| Franchise + platform separate | Clean conflict of interest, stronger pitch to competitors |
| AI recruiting agent bundled | Agencies need operational win, not just reputation |
| Supabase over Express/VPS | Free tier, no server management, auto-scales |
| Vercel over others | Best DX for Vite/React, generous free tier |
| Intersection Observer over Framer Motion | Lighter for scroll reveals, no extra dependency |
| PostCSS config required | Tailwind+Vite requires it — causes silent failures without |

---

## Current Status

### ✅ Completed
- Landing page SPEC written
- Full React landing page built
- Production build verified
- PostCSS + Tailwind + Vite configured correctly
- Lucide icons implemented
- Email form with validation + success/error states
- FAQ accordion
- Scroll reveal animations (Intersection Observer)
- Project LESSONS.md created
- Generic LESSONS.md updated
- Romy's USER.md updated with project context
- Project memory file created (this file)
- GitHub repo created: `https://github.com/ocdeployments/reliantcare`
- **LIVE on Netlify: https://reliantcare.netlify.app** ← THE BIG ONE

### ⏳ Pending — Next Steps
1. Privacy policy page (needed before public launch)
2. Connect email form to Supabase backend (waitlist table)
3. Supabase account setup (free tier)
4. Outreach begins — Reddit posts, Facebook groups, caregiver DMs
5. Caregiver portal design spec

### 🔜 Next (After Deploy)
1. Real email capture (Supabase edge function)
2. Privacy policy page
3. Caregiver portal design spec
4. Database schema design (Supabase)
5. Agency outreach begins (Reddit, Facebook groups)

---

## Key Files

| File | Purpose |
|---|---|
| `reliantcare/SPEC.md` | Full design spec, colors, copy, layout |
| `reliantcare/LESSONS.md` | Project-specific engineering lessons |
| `reliantcare/MEMORY.md` | This file — authoritative project memory |
| `reliantcare/src/App.jsx` | Complete React application |
| `reliantcare/src/index.css` | Tailwind + custom styles + reveal classes |
| `reliantcare/tailwind.config.js` | Color system, typography, animations |
| `reliantcare/postcss.config.js` | Required for Tailwind+Vite |
| `reliantcare/vercel.json` | Vercel deploy config |

---

## Who Romy Is (Context for This Project)

- Entrepreneur, moving to Texas (before August 2026) to run Assisting Hands franchise
- Building ReliantCare as a separate platform business from Canada now
- Zero existing agency relationships — starting from zero
- Strong on product thinking, needs execution support
- Free-first philosophy: no paid tools unless clearly necessary
- Will provide credentials when asked
- Wants to be informed, not asked
- Has zero tolerance for unexpected charges

---

## What Sheldon Senior Handles

- All messaging and brand writing
- All outreach templates (Reddit, Facebook, LinkedIn, cold email)
- All product specs and feature specs
- Coding: spawning and managing agents for builds
- Research: competitor analysis, market data, tools
- Project planning and sequencing

---

## What Romy Needs to Do

- Account creation: GitHub, Vercel, Supabase, Twilio (eventually)
- Providing credentials when tools need auth
- Franchise due diligence (Assisting Hands agreement review)
- Agency relationship building (hand-to-hand, cannot be automated)
- Final product decisions (this is Romy's company — final calls are always his)

---

*Last session summary (2026-03-30): Landing page fully built and running on localhost:5173. Full product vision documented. Competitive landscape researched. Messaging strategy written. Lessons learned captured.*
