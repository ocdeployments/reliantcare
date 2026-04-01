# ReliantCare Network — Master Project File

> Compiled: 2026-04-01
> Single source of truth. Download this and you have everything.

---

# PART 1 — THE VISION

## The Problem Being Solved

The caregiving industry runs on gut feel and blind hiring.

- **Caregivers** lose their reputation every time they change employers — starting from zero with every new agency
- **Agencies** hire without real data and lose good people in the first 90 days
- **Families** have no trusted way to find vetted care

There is no infrastructure for trust.

## The Solution

A platform where:
- **Caregivers** build one verified, portable profile — credentials, work history, reliability score, care ratings — uploaded once, owned forever, shared with every agency
- **Agencies** search and recruit from pre-verified, scored caregivers. Real data, not self-reported. AI recruiting agent handles screening and scheduling
- **Families** submit a short intake form and get matched with verified local agencies. Two-sided ratings visible — agency AND caregiver

## The Franchise Connection

Romy is buying an **Assisting Hands** franchise in Texas (before August 2026). ReliantCare Network is a **separate business** — owned by Romy, complementary to the franchise.

- ReliantCare is the platform/technology business
- Assisting Hands franchise is the operating agency
- The franchise becomes the **anchor customer and data source** — proof the platform works
- When pitching other agencies: "I built this because I was running an agency and needed it"

---

# PART 2 — THE THREE PRODUCTS

## Product 1: ReliantCare Network (Core — The Trust Infrastructure)
- Portable caregiver profiles
- Two-sided ratings: agency rates caregiver (high weight) + family rates caregiver (medium weight)
- Reply mechanism: caregiver can respond to agency ratings — two-sided story, not one-sided
- Credential vault: uploaded once, verified by agencies
- Reliability score: shift completion rate, no-show frequency, care quality
- **Free for caregivers forever**

## Product 2: ReliantCare Recruit (Agency Tool — The AI Recruiting Agent)
- Voice + SMS automated screening conversations
- Configurable screening questions per agency
- Interview scheduling with calendar sync
- Re-engagement and nurture campaigns
- Reduces 70%+ of agency recruiting time
- Integrates with ReliantCare profiles — screens against verified history

## Product 3: Family Matching (Demand Side — Later Phase)
- Short intake form
- Matched with verified local agencies
- Agency ratings visible to families
- Simple, private, guided

---

# PART 3 — THE DATA MOAT

The two-sided verified reputation system is the core moat:
- Reputations are earned through real work
- Verified by multiple independent sources: agencies, families, platform admin
- Not portable from elsewhere — built here, owned here
- Reply mechanism makes it credible and non-gaming
- Over time, a caregiver's score is undeniable — backed by 3-5 agency confirmations

---

# PART 4 — THE CHICKEN-AND-EGG PROBLEM

**The standard problem:** Caregivers won't join without agencies. Agencies won't pay without caregivers.

**The ReliantCare solution:**
1. Build caregiver waitlist first (pure marketing, no platform needed)
2. Romy's Assisting Hands franchise launches → generates real shift data from day 1
3. Franchise IS the first agency → provides critical mass of data
4. Platform pitch to other agencies: "This is how we run our own agency. Here's the actual data."
5. Other agencies join because Romy has proof, not just a pitch

---

# PART 5 — MARKET DATA

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

# PART 6 — COMPETITIVE LANDSCAPE

| Platform | What They Do | ReliantCare Difference |
|---|---|---|
| Caring Support (Canada) | Job board, profile builder | No portable reputation, no two-sided ratings |
| CareLinx (US) | Agency replacement — families hire CareLinx directly | Not portable, single-company model |
| Activated Insights Recruit | AI recruiting agent for agencies | No caregiver profile/reputation layer |
| HomeCareGPT / Sage | Intake automation for agencies | No trust infrastructure |
| Honor, Visiting Angels | Traditional agencies | No portable reputation system |

**The gap no one has filled:** Portable cross-agency caregiver reputation with two-sided ratings and reply mechanism.

---

# PART 7 — BRAND GUIDELINES

## Name & Tagline
- **Name:** ReliantCare Network
- **Tagline:** Don't start from zero again.
- **Domain:** reliantcarenetwork.com
- **Feel:** Clear, confident, human. Editorial warmth. Not corporate, not warm-and-fuzzy.

## Voice
- Direct. Respectful. Like a smart colleague who gets it.
- Plain English. Short sentences. Active voice.
- No "ecosystem." No "journey." No "empower."
- Speaks to the specific pain — caregivers starting from zero every time they switch

## Color Palette
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

## Typography
- Inter (Google Fonts) — 400/500/600/700/800
- Single family — weight creates hierarchy

---

# PART 8 — TECH STACK

## Built
- React 18 + Vite
- Tailwind CSS + PostCSS
- Lucide React (icons)
- Intersection Observer (scroll reveals)
- Google Fonts (Inter)

## Pending
- Supabase — database, auth, edge functions
- Vercel — hosting
- GitHub — code repository
- Twilio — SMS + voice for recruiting agent
- OpenAI API — AI brain for recruiting agent

---

# PART 9 — PHASED BUILD PLAN

## Phase 0 — Waitlist Engine (NOW)
**Goal:** 500 caregiver emails before building anything else
- Landing page ✅ BUILT + LIVE
- Caregiver waitlist form ✅ BUILT
- Survey (this document) ✅ DESIGNED
- Privacy policy page ✅ LIVE
- Analytics → pending
- Survey implementation → pending

## Phase 1 — Caregiver Portal
**Goal:** 50 caregiver profiles live with real-ish data
- Full caregiver signup + profile builder
- Credential upload (PSW cert, CPR, TB test, vulnerable sector)
- Profile view with reliability score
- Supabase backend: waitlist table, caregiver profiles table
- Agency portal: search caregivers, view profiles

## Phase 2 — Agency Portal + Two-Sided Ratings
**Goal:** 5-10 agency pilots (hand-to-hand onboarding)
- Agency dashboard: search, filter, view full caregiver history
- Agency posts ratings: shift completion, no-shows, care quality
- Caregiver responds to ratings (reply mechanism)
- Family rating (after agency + caregiver both rate)
- Reliability score algorithm

## Phase 3 — AI Recruiting Agent
**Goal:** One agency using the full recruiting agent
- Twilio setup (SMS + voice)
- Screening conversation flow (LLM-powered)
- Interview scheduling with Google Calendar API
- Agency dashboard: view screened candidates, schedule
- Integration with ReliantCare profiles — screen against verified history

## Phase 4 — Family Matching
**Goal:** Families getting matched, first reviews live
- Family intake form
- Match algorithm: location + care type + availability
- Family rates agency after service
- Agency rating visible to future families

## Phase 5 — US Expansion (Texas Franchise Launch)
**Goal:** ReliantCare used by franchise on day 1, proof of concept established
- Assisting Hands franchise goes live → generates first real data
- Texas data used as proof of concept for other agencies
- Recruit other Assisting Hands franchisees to join platform

## Phase 6 — Scale
**Goal:** Canada full launch, monetization
- Ontario first, then BC, AB
- US expansion through Assisting Hands franchise network
- Monetization: agency subscription tiers

---

# PART 10 — MONETIZATION

**Caregivers: Free forever**
- Pulls the supply side in — no barrier to entry
- Competitor platforms (CareLinx, Caring Support) charge or restrict caregivers

**Agencies: Freemium**
- Free tier: basic profile viewing, limited searches
- Paid tier: full recruiting agent, advanced filters, unlimited screening, scheduling automation
- Estimated: $100-300/month per agency

**Monetization approach:** Standard two-sided marketplace pattern — most successful marketplaces monetize from one side only. Agencies are the paying side.

---

# PART 11 — LANDING PAGE COPY

## Hero

**H1:** Don't start from zero again.

**Subheadline:** ReliantCare builds your verified, portable reputation profile — free forever. One place your credentials, work history, and score travel with you across every agency.

**CTA Button:** Build My Profile — It's Free

**Trust line:** 🔒 No credit card. No catch. Free forever.

---

## Problem Section

**Pain 1 — You start from zero every time**
Every new agency asks you to re-upload every credential, re-verify every reference. Even if you've been doing this for 10 years.

**Pain 2 — Your reputation lives in someone else's file**
Your shift history, your reliability record, your family ratings — none of it follows you when you leave. The agency owns it. You don't.

**Pain 3 — The good ones leave. You know why.**
Caregivers quit not because of the work — but because the system doesn't respect what they've built. The hours, the consistency, the trust they've earned. It all disappears at the door.

---

## Solution Section

**H2:** The first reputation system built for caregivers

**Feature 1 — Verified credentials. Uploaded once.**
PSW certification, CPR, TB test, vulnerable sector check — uploaded once, confirmed by agencies, yours forever.

**Feature 2 — A score built from real work**
Your reliability and care rating are verified by the agencies you've worked with — and the families you've cared for. Not self-reported. Not gameable.

**Feature 3 — Your work history. Not a resume.**
Every shift logged, every engagement rated, every reference named. A complete picture of who you are as a caregiver — built by the people who actually worked with you.

---

## How It Works

**H2:** Three steps. Ten minutes. Yours forever.

**Step 01 — Create your profile**
Tell us who you are, what you've done, and upload your credentials. Takes about 10 minutes.

**Step 02 — Agencies confirm your history**
Every agency you work with verifies your shift history and adds their rating. Over time, your profile becomes undeniable.

**Step 03 — Your reputation follows you**
One link. Share it with any agency. They see exactly who you are and what you've done. No more starting from zero.

---

## Social Proof

**Quote:**
> "I've been a PSW for 7 years. Every time I switched agencies, I lost everything — my standing, my references, my history. I had to prove myself from scratch every single time. This is the first thing that's actually for us."

**— Maria T., PSW, Ottawa**

---

## For Agencies

**H2:** Stop hiring blind. Start hiring proven.

**Body:** ReliantCare gives your agency a verified pool of pre-screened caregivers. You see real shift history, real reliability scores, and real feedback — before you make an offer. Our AI recruiting agent handles the screening and scheduling so you're not losing hours to phone tag.

**CTA:** Agency? Get early access →

---

## FAQ

**Q: Is this really free for caregivers?**
Yes. Caregivers get a free profile forever. No credit card, no tiered plan, no catch. Agencies pay for access to the recruiting and screening tools. That's how we keep it free for the people who need it most.

**Q: How is my reputation verified?**
Your profile is built from data confirmed by the agencies you've worked with — not self-reported claims. The more agencies that confirm your history, the stronger your profile becomes.

**Q: Who owns my data?**
You do. Your profile, your history, your ratings — all yours. You control what gets shared and with whom. We never sell your data.

**Q: Does this work across different agencies?**
Yes. Your profile works with any agency on the platform — in any city. Move from Ottawa to Toronto, your reputation moves with you.

**Q: When does this launch?**
We're building now. Early access opens to caregivers in Ontario first, then expands across Canada and into the US. Join the waitlist and we'll tell you first.

**Q: What about my family's privacy?**
Family ratings are shared with your consent and are tied to your profile — not to the family's personal information. We don't store medical data, address, or anything beyond your caregiving history.

---

## Footer

**Tagline:** Built for caregivers. Free forever.
**Copyright:** © 2026 ReliantCare Network. All rights reserved.

---

# PART 12 — THE CAREGIVER SURVEY

## The Final 10 Questions (Landing Page Survey)
### Grade 5 reading level — Plain language throughout

---

**INTRO:** We're building something for you. Have you ever started at a new agency and had to prove yourself all over again — even after years of great work? We're building a free platform where caregivers can build their reputation once, show it everywhere, and never start from zero again. This takes about 3 minutes. When we launch, you get early access as a founding caregiver.

---

**Q1. What's the hardest part about being recognized for what you can actually do?**
*(open text)*

*What this tells us: The core emotional hook for the landing page.*

---

**Q2. Have you ever lost a job, a client, or a shift because you couldn't prove your experience fast enough?**
- Yes, this has happened to me
- Yes, it almost happened once
- No, but it's been close
- No

*What this tells us: How common this problem is — market sizing.*

---

**Q3. What was the hardest part about your last job change or new client?**
*(open text)*

*What this tells us: Specific pain points we can name on the landing page.*

---

**Q4. What matters most on your caregiver profile? Pick the 3 that matter most.**
- My years of experience
- What past clients and families say about me
- My reliability record — I show up
- My skills and training
- My certifications and credentials
- Something else

*What this tells us: Profile structure — what to build first.*

---

**Q5. If you had a caregiver ID card — a digital badge — what would make you proud to show it to someone?**
*(open text)*

*What this tells us: What the ID card should look like and what makes it worth sharing.*

---

**Q6. Would you feel more in control of your career if your reputation could follow you from agency to agency?**
- Yes — a lot
- Yes — a little
- Maybe
- No — not really

*What this tells us: Does our core idea resonate? Should we lead with this?*

---

**Q7. What would make you tell a fellow caregiver about this platform?**
- It's free to join
- It helps you get hired faster
- Other caregivers I know are on it
- It keeps my reputation safe and mine
- Other *(type it in)*

*What this tells us: What drives word-of-mouth. How to get the first caregivers to tell others.*

---

**Q8. Which badges would mean the most to you? Pick the 2 that matter most.**
- A badge that says you show up on time — every time
- A badge that says families always ask for you by name
- A badge that says you're trained in dementia or memory care
- A badge that says you've been doing this for a long time
- A badge that says you've gone above and beyond at least 5 times
- Something else

*What this tells us: Which badges to build first. What caregivers are most proud of.*

---

**Q9. Is there anything about your work history or personal life that you would never want on a public profile?**
*(open text)*

*What this tells us: Privacy lines we cannot cross. What to never ask for.*

---

**Q10. You're almost there.** When we launch, you get early access as a founding caregiver — before anyone else.

*[Your email address]*
*We'll only email you when something important happens. We won't share your email with anyone.*

*What this tells us: Email capture — the waitlist.*

---

## Survey Strategic Notes

**Why these questions work:**
- Grade 3-5 language throughout — every caregiver can answer
- No jargon: no "portability", "reputation system", "credentials", "verified"
- Founding caregiver promise at the end — they know what they get
- Emotional validation + product design + acquisition strategy in 10 questions
- Privacy boundary question builds trust before asking for email

**What was removed:**
- All questions about paying for premium (too early)
- Demographics (goes in post-signup survey)
- Questions using words like "portability", "reputation system"

**What was added:**
- Simple intro with founding caregiver promise
- Email capture framed as reward
- Closing message that makes them feel like insiders

---

# PART 13 — CURRENT STATUS

## ✅ Completed
- Landing page SPEC written
- Full React landing page built + LIVE at https://www.reliantcarenetwork.com
- Production build verified
- PostCSS + Tailwind + Vite configured correctly
- Lucide icons implemented
- Email form with validation + success/error states
- FAQ accordion
- Scroll reveal animations (Intersection Observer)
- GitHub repo created: https://github.com/ocdeployments/reliantcare
- Supabase email capture fully wired
- Privacy policy page live
- Corporate email: info@reliantcarenetwork.com created (Zoho Mail)
- DNS propagated, Zoho MX records added
- All outreach messages drafted and ready to post (OUTREACH.md)
- Caregiver portal spec written (PORTAL-SPEC.md)
- Survey designed: 10 questions ready for implementation

## 🔜 Next Steps
1. Survey implementation (Typeform, Google Forms, or built-in)
2. Outreach begins — Reddit posts, Facebook groups, caregiver DMs
3. Analytics setup (privacy-compliant)
4. Caregiver portal design + build (Phase 1)

---

# PART 14 — KEY FILES

| File | Purpose |
|---|---|
| `SPEC.md` | Full design spec, colors, copy, layout |
| `BLUEPRINT.md` | Master build plan, all phases |
| `SURVEY_QUESTIONS.md` | Survey questions + strategic notes |
| `SURVEY_ANALYSIS.md` | Full 27-question redundancy audit |
| `PORTAL-SPEC.md` | Caregiver portal full spec |
| `OUTREACH.md` | All Reddit, Facebook, LinkedIn, email templates |
| `LESSONS.md` | Engineering lessons learned |
| `src/App.jsx` | Complete React landing page |
| `src/index.css` | Tailwind + custom styles + reveal classes |
| `tailwind.config.js` | Color system, typography, animations |
| `postcss.config.js` | Required for Tailwind+Vite |

---

# PART 15 — WHO ROMY IS

- Entrepreneur, moving to Texas (before August 2026) to run Assisting Hands franchise
- Building ReliantCare as a separate platform business from Canada now
- Zero existing agency relationships — starting from zero
- Strong on product thinking, needs execution support
- **Free-first philosophy:** no paid tools unless clearly necessary
- Will provide credentials when asked
- **Wants to be informed, not asked**
- **Has zero tolerance for unexpected charges**

---

*End of Master File. Last updated: 2026-04-01*
