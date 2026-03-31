# ReliantCare Network — Master Blueprint

> The plan from zero to launch. Updated: 2026-03-30.

---

## The Big Picture

```
Today ──────────────────────────────────────────────────────► Launch

PHASE 0          PHASE 1         PHASE 2        PHASE 3+        PHASE 5
(Waitlist)   (Caregiver Portal) (Ratings)    (AI Agent)    (Texas + Scale)

We are here ──────►
                  
Build demand     Build supply    Build trust    Build leverage  Grow
No platform      No agencies     No revenue     No full stack   Revenue
needed yet       needed yet      needed yet     needed yet      
```

---

## Phase 0 — The Waitlist Engine
**Timeline:** Now → ~4-6 weeks
**Budget:** $0
**Goal:** 500 caregiver emails on a live page

### What We Build
| Asset | Status |
|---|---|
| Landing page (all sections) | ✅ Done |
| Email capture → Supabase | 🔜 Next |
| Privacy policy page | 🔜 Next |
| OG meta tags + social sharing | ✅ Done |
| Favicon + brand identity | ✅ Done |

### What We Do (Outreach)
| Channel | Action |
|---|---|
| Reddit | 1 post in r/CaregiverSupport, 1 in r/ontario, 1 in r/askTO |
| Facebook | 2-3 posts in independent PSW groups |
| LinkedIn | Update personal profile headline, 1 post |
| Cold email | None yet — wait for page credibility first |

### How to Know If It's Working
- 50 emails/week = green light, keep going
- 20-50 emails/week = improve messaging, try different posts
- Under 20/week = rethink the pitch or channel

### Exit Criteria for Phase 1
✅ Landing page live at real URL
✅ 500 emails in hand (or evidence of demand)
✅ At least 3 caregiver conversations started (DMs, replies)

---

## Phase 1 — The Caregiver Portal
**Timeline:** After Phase 0 success
**Budget:** $0 (Supabase free tier)
**Goal:** 50 verified caregiver profiles live

### What We Build
```
Caregiver Portal
├── Signup / Login (Supabase Auth)
├── Profile Builder
│   ├── Basic info (name, city, type, bio)
│   ├── Credential Upload (PSW cert, CPR, TB, VS check)
│   ├── Work History (self-reported for now)
│   └── Availability + preferences
├── Public Profile Page (shareable link)
├── Dashboard (view own score, ratings, history)
└── Notification system (when rated, when reviewed)

Agency Portal
├── Agency signup / login
├── Search caregivers (filters: city, type, score, availability)
├── View public profiles + verified history
├── Send interview invite
└── Dashboard (matches, pipeline)
```

### Database Schema (Supabase)
```
Tables:
├── caregivers        (id, name, email, phone, city, type, bio, created_at)
├── agencies           (id, name, email, city, created_at)
├── credentials        (caregiver_id, type, uploaded_at, verified_by, status)
├── work_history       (caregiver_id, agency_id, start_date, end_date, role)
├── ratings            (id, from_type, from_id, to_caregiver_id, score, comment, created_at)
├── caregiver_response (rating_id, response_text, created_at)
├── shifts             (caregiver_id, agency_id, date, status, no_show)
└── waitlist          (id, email, source, created_at)
```

### Exit Criteria for Phase 2
✅ 50 caregiver profiles created
✅ 5 agencies signed up (hand-to-hand)
✅ First agency has searched and found profiles useful

---

## Phase 2 — The Reputation System
**Timeline:** After Phase 1
**Budget:** $0
**Goal:** Two-sided ratings live, first scores calculated

### What We Build
```
Ratings Engine
├── Agency rates caregiver (shift completion, reliability, care quality)
├── Family rates caregiver (care quality, punctuality, communication)
├── Weighted score algorithm:
│   Agency weight: HIGH (shift data is objective)
│   Family weight: MEDIUM (subjective but adds texture)
├── Caregiver reply mechanism (respond to any rating)
├── Score display: 1-5 with breakdown (not a single number)
└── Appeal process: flag suspicious ratings

Data Verification Layer
├── Agency confirms caregiver's shift history (per engagement)
├── Self-reported history marked as "unverified"
├── After 2+ agency confirmations → "Verified" badge
└── After 5+ → "Highly Verified" tier
```

### Agency Onboarding (Hand-to-Hand)
Steps:
1. Identify 5 agencies in one city (Ottawa or Toronto)
2. Book intro call (Calendly link in outreach)
3. Demo: show them the caregiver profiles, explain the scoring
4. Pilot offer: free 30 days, no credit card
5. Onboard: connect their scheduling data (IFX API or manual)
6. First rating: rate one current caregiver they trust

### Exit Criteria for Phase 3
✅ At least 3 agencies actively rating caregivers
✅ 100+ ratings in the system
✅ First caregiver reply to a rating received

---

## Phase 3 — The AI Recruiting Agent
**Timeline:** After Phase 2
**Budget:** ~$15 (Twilio trial) + OpenAI trial
**Goal:** One fully automated screening conversation

### What We Build
```
Recruiting Agent
├── Twilio integration (SMS number + voice line)
├── Screening conversation flow (LLM-powered):
│   Step 1: Caregiver texts "Hi" → Agent responds
│   Step 2: Agent asks: availability, experience, certifications
│   Step 3: Agent collects: city, care type, hourly rate
│   Step 4: Agent schedules interview if qualified
│   Step 5: Confirmation SMS sent to both parties
├── Google Calendar API (interview scheduling)
├── Agency dashboard: view screened candidates + schedule
├── Reminder sequences (SMS to candidate before interview)
└── Re-engagement: "Hey, we have new shifts available" → after 30 days

Integration with ReliantCare Profiles
├── Agent pulls candidate's ReliantCare score before screening
├── Score displayed to agency in dashboard
├── Screening questions skip pre-verified info
└── Final candidate packet includes: profile + screening + score
```

### How the Agent Sounds
Not robotic. Not corporate. Like a helpful recruiter who actually read the caregiver's profile.

Example:
> "Hi Sarah — I see you have your PSW cert and 3 years of dementia care experience. Quick question — are you available for morning shifts in the Ottawa area? If yes, I'd love to set up a 15-min call with [Agency Name]. Worth 2 mins of your time?"

### Exit Criteria for Phase 4
✅ One agency using recruiting agent in production
✅ 10+ screening conversations completed
✅ First hire made through the platform

---

## Phase 4 — Family Matching
**Timeline:** After Phase 3
**Budget:** $0
**Goal:** Families getting matched, first reviews

### What We Build
```
Family Side
├── Intake form (5 questions):
│   1. What type of care is needed? (companion, personal, medical)
│   2. Location / city
│   3. Frequency needed? (daily, weekly, occasional)
│   4. Budget range (optional)
│   5. Any special requirements? (language, experience, gender)
├── Match algorithm:
│   Location → filter to local agencies
│   Care type → filter by caregiver specialization
│   Availability → filter by schedule match
│   Score → rank by reliability score (descending)
├── Matched agencies list (3-5 options) with:
│   Agency name, rating, specialties, price range
├── Family books intro call with agency
└── After service: rate the agency (not caregiver)
```

### Exit Criteria for Phase 5
✅ First family matched to an agency
✅ First family rating submitted
✅ Loop closed: caregiver → agency → family → caregiver

---

## Phase 5 — Texas + US Expansion
**Timeline:** August 2026 (franchise purchase) → 12 months
**Budget:** Franchise investment ($95K-$177K total)
**Goal:** ReliantCare used in one live franchise, proof of concept established

### The Texas Move
```
Assisting Hands Franchise → Opens
         │
         ├── IFX Online → Scheduling, billing, operations
         └── ReliantCare → Recruiting, retention, trust infrastructure

Every caregiver hired → ReliantCare profile created
Every shift completed → Data fed into reliability score
Every family served → Family rating submitted

Texas franchise generates PROOF:
"We did X shifts, Y caregivers, Z retention rate improvement"
This data → pitch to other Assisting Hands franchisees
```

### The Pitch to Other Franchisees
> "I run an Assisting Hands franchise in [city]. I built ReliantCare to solve my own hiring problem. After 6 months:
> - Caregiver retention up X%
> - Time-to-hire down Y days
> - No-show rate down Z%
> It's free for the first 3 months. Want to see how it works?"

### US Expansion Path
1. Target: Assisting Hands franchise network (225 units)
2. Sell to 5-10 franchisees as early adopters
3. Data from 10 agencies validates the product nationally
4. Open to non-Assisting Hands agencies

---

## Phase 6 — Canada Full Launch
**Timeline:** After Texas proof of concept
**Budget:** Revenue-funded or raise
**Goal:** Canada-wide coverage, monetization

### Canada Expansion Sequence
1. Ontario first (Ottawa → Toronto → Hamilton → London)
2. British Columbia (Vancouver, Victoria)
3. Alberta (Calgary, Edmonton)
4. Quebec (Montreal — French considerations)

### Monetization Kicks In
| Tier | Price | What's Included |
|---|---|---|
| Agency Free | $0 | View profiles, basic search |
| Agency Starter | $99/mo | Full search, 20 screened candidates/mo |
| Agency Pro | $249/mo | Unlimited screening, calendar sync, advanced analytics |
| Agency Enterprise | Custom | White-label, API access, dedicated support |

---

## The Non-Negotiables

These rules apply across ALL phases:

1. **Caregiver data is sacred.** Never sell, never leak. This is health-related personal data.
2. **Caregivers free always.** This is the supply-side anchor. Never charge them.
3. **Two-sided ratings are the moat.** Never soften the reply mechanism. It makes the whole system credible.
4. **Free first, always.** No paid tools unless they directly generate revenue or save significant time.
5. **No building for scale before we have a scaling problem.** Build what's needed now. Not what's needed at 10,000 users.
6. **Hand-to-hand agency sales cannot be skipped.** The software is the easy part. The relationship is everything.

---

## The Weekly Rhythm

### Every Week (Ongoing)
- [ ] Check waitlist growth (Supabase)
- [ ] Respond to any caregiver DMs (Reddit, Facebook, LinkedIn)
- [ ] Update project memory file if anything changes
- [ ] Log lessons learned in LESSONS.md

### Phase 0 Specific (Now)
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Post to Reddit (1x/week, fresh angle each time)
- [ ] Post to Facebook PSW groups (1x/week)
- [ ] DM individual caregivers who engaged (personal, not automated)

### Phase 1+ Specific
- [ ] Onboard new caregiver profiles
- [ ] Weekly agency outreach (5 new contacts/week)
- [ ] Track ratings being submitted
- [ ] Monitor score distribution — is it meaningful?

---

## What Success Looks Like

### Year 1 (End of 2026)
- 5,000 caregiver profiles
- 50 agencies using the platform
- 1 AI recruiting agent live
- Texas franchise operating with ReliantCare
- First revenue (agency subscriptions)

### Year 2
- 25,000 caregiver profiles
- 200 agencies
- Family matching launched
- Canadian expansion (Ontario)
- Series A consideration (if VC fits the vision)

---

*This blueprint is a living document. Update it when decisions change, when phases take longer or shorter than expected, or when new information changes the picture.*
