# ReliantCare Network — Waitlist Landing Page Spec

## 1. Concept & Vision

A waitlist page for caregivers that feels like the first breath of fresh air in a room full of corporate healthcare websites. Not another SaaS landing page. Not another "we're here to help" landing page. A page that makes a caregiver think: **"They get it."**

The page speaks to one person — a skilled caregiver who's been burned by the system — and makes one ask: *give us 10 minutes, build your profile, never start from zero again.*

The feeling: clear, confident, human. Like a tool built by someone who actually did the work.

---

## 2. Design Language

### Aesthetic Direction
**Minimal, editorial warmth.** Think Headspace meets Linear.app. Clean whitespace, confident typography, one strong accent color. Not cold medical blue. Not warm fuzzy stock photo territory. Something that feels professional but also feels like it was made by people who care about the people using it.

### Color Palette
```
--bg:           #FAFAF8   (warm off-white, not pure white)
--bg-alt:      #F2F0EC   (slightly warmer, for contrast sections)
--navy:         #1A2B4A   (deep navy — trust, stability, authority)
--amber:        #F59E0B   (warm amber — energy, action, humanity)
--amber-light:  #FEF3C7  (soft amber — highlight, badges)
--text:         #1A1A1A   (near-black)
--text-muted:   #6B7280   (muted gray for secondary text)
--border:       #E5E5E3   (subtle warm-gray borders)
--white:        #FFFFFF
```

### Typography
- **Display/Headings:** Inter (800 weight) — bold, modern, confident. Not playful. Not serif. Sharp.
- **Body:** Inter (400/500 weight) — same family, different weight creates hierarchy without mixing fonts.
- **Accent/Numbers:** Inter (600) — used for stats and badges.

### Spatial System
- Base unit: 8px
- Section padding: 96px vertical on desktop, 64px on mobile
- Container max-width: 1120px
- Content max-width: 680px (for readable text columns)
- Generous whitespace — let the content breathe

### Motion Philosophy
- **Entrance animations:** Fade up (opacity 0→1, translateY 24px→0), 500ms ease-out, staggered 80ms between elements. Subtle. Premium feel.
- **Scroll-triggered reveals:** Sections animate in as user scrolls. Light, not distracting.
- **Hover states:** Buttons scale 1.02, cards lift with subtle shadow. Micro-feedback only.
- **No:** Bouncing, spinning, autoplay animations, flashing anything.

### Visual Assets
- **Icons:** Lucide icons (consistent, clean, free)
- **Illustrations:** None. The design is the illustration.
- **Photos:** None. We are not using stock photos of elderly people or caregivers. The words do the work.
- **Decorative elements:** Subtle grid or dot pattern in background. Amber accent lines. Nothing else.

---

## 3. Layout & Structure

### Page Flow (Top to Bottom)

```
[NAVIGATION BAR]
  Logo (left)          [Join Waitlist] button (right)

[HERO SECTION]
  Headline (H1)
  Subheadline (1 line)
  Email input + CTA button (centered, large)
  Trust line below input (small, muted)

[PROBLEM SECTION]
  Section label: "The problem"
  3 pain points side by side (icon + title + 1 line)

[SOLUTION SECTION]
  Section label: "What we built"
  Headline
  3 feature blocks (icon + title + description)
  Screenshot/visual of the profile card (decorative)

[HOW IT WORKS SECTION]
  Section label: "How it works"
  3 steps (numbered 01, 02, 03) — horizontal on desktop, vertical on mobile

[SOCIAL PROOF SECTION]
  Quote (1 powerful testimonial — real or illustrative)
  Name, role, city (not stock photo)
  Background: --bg-alt

[FOR AGENCIES SECTION]
  Section label: "For home care agencies"
  Short pitch for agencies
  Secondary CTA: [Agency? Get early access]

[FAQ SECTION]
  5-6 questions, accordion style
  Keep answers short

[FINAL CTA SECTION]
  Strong headline
  Email input + button (repeat of hero)
  Trust line

[FOOTER]
  Logo
  One line: "Built for caregivers. Free forever."
  Copyright
```

### Responsive Strategy
- Mobile-first CSS
- Single column on mobile, two/three column on desktop
- Font sizes scale: H1 40px mobile → 64px desktop
- Input fields full-width on mobile, centered max-width on desktop
- Section padding halves on mobile

---

## 4. Features & Interactions

### Email Signup Form
- Single field: email address
- Placeholder: "Your email address"
- Button: "Build My Profile — It's Free"
- On submit: validate email format → show success state inline
- Success state: field replaced with "You're on the list. We'll be in touch." + checkmark
- Error state: red border, message below: "Please enter a valid email"
- No page reloads — pure JS/React state

### Navigation CTA
- "Join Waitlist" in nav scrolls to email input
- On mobile: same button, smaller

### FAQ Accordion
- Click question → expand answer with smooth height animation (200ms)
- Only one open at a time
- Chevron rotates on open

### Scroll Behavior
- Nav stays fixed at top
- Nav background becomes solid (--navy) with blur when scrolled past hero
- Smooth scroll to sections when anchor links clicked

### Hover States
- CTA button: scale 1.02, slight shadow lift
- FAQ questions: text color shifts to --navy
- Agency CTA: ghost button becomes solid on hover

---

## 5. Component Inventory

### Navigation Bar
- **Default:** transparent background, navy logo, amber CTA button
- **Scrolled:** white background with subtle shadow, same content
- **Mobile:** hamburger not needed — CTA only, fits on screen

### Hero Section
- H1: 40-64px, --navy, weight 800
- Subheadline: 18-20px, --text-muted, weight 400
- Input: large, 56px height, rounded 12px, border 2px --border
- Button: amber background, navy text, rounded 12px, 56px height
- Trust line: 14px, --text-muted, small lock icon

### Pain Point Cards
- Icon: 40px, --amber
- Title: 18px, weight 600, --navy
- Description: 15px, --text-muted
- Border: 1px --border
- Padding: 32px
- Hover: subtle shadow lift

### Feature Blocks
- Icon: 32px, --amber, in a soft amber circle (32px padding)
- Title: 20px, weight 700, --navy
- Description: 16px, --text-muted

### Step Blocks (How It Works)
- Number: 48px, weight 800, --amber
- Title: 20px, weight 700
- Description: 16px, --text-muted

### Testimonial Card
- Quote: 24px, italic, weight 400, --navy
- Attribution: 14px, --text-muted
- Background: --bg-alt
- Padding: 48px
- Border-left: 4px --amber

### FAQ Item
- Question: 16px, weight 600, --navy, with chevron right
- Answer: 15px, --text-muted, padding-top 12px
- Divider: 1px --border between items
- Open state: chevron rotates 90deg, answer expands

### Agency Section CTA
- Background: --navy
- Text: white
- Button: ghost — white border, white text, becomes solid white on hover with navy text

### Footer
- Background: --navy
- Text: white/--text-muted
- Simple, minimal

---

## 6. Technical Approach

### Stack
- **Framework:** React (via Vite) or Next.js
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (light use — entrances, accordions)
- **Icons:** Lucide React
- **Hosting:** Vercel (free tier)
- **Form handling:** React state + API route to Supabase or simple webhook

### Key Implementation Notes
- Single page, no routing needed
- All sections as React components
- Scroll progress tracked with Intersection Observer for entrance animations
- Email captured to Supabase table "waitlist" (email, timestamp, source: "landing_page")
- No backend needed for MVP — Supabase handles it
- OG meta tags for social sharing (when link is shared)

### Form Submission Flow
```
User enters email → 
  validate (client-side) → 
  POST to /api/waitlist (Next.js API route or Supabase Edge Function) →
  Insert into Supabase "waitlist" table →
  Return success →
  Update UI to success state
```

---

## 7. Copy — Every Word

### Navigation
- Logo: **ReliantCare** (wordmark, bold, navy)
- CTA: **Join Waitlist**

---

### Hero

**H1:**
> Don't start from zero again.

**Subheadline:**
> ReliantCare builds your verified, portable reputation profile — free forever. One place your credentials, work history, and score travel with you across every agency.

**CTA Button:**
> Build My Profile — It's Free

**Trust line (below button):**
> 🔒 No credit card. No catch. Free forever.

---

### Problem Section

**Section label:** The problem

**Pain 1 — Icon: X-circle**
> You start from zero every time
> Every new agency asks you to re-upload every credential, re-verify every reference. Even if you've been doing this for 10 years.

**Pain 2 — Icon: Users**
> Your reputation lives in someone else's file
> Your shift history, your reliability record, your family ratings — none of it follows you when you leave. The agency owns it. You don't.

**Pain 3 — Icon: TrendingDown**
> The good ones leave. You know why.
> caregivers quit not because of the work — but because the system doesn't respect what they've built. The hours, the consistency, the trust they've earned. It all disappears at the door.

---

### Solution Section

**Section label:** What we built

**H2:**
> The first reputation system built for caregivers

**Feature 1 — Icon: Shield-check**
> Verified credentials. Uploaded once.
> PSW certification, CPR, TB test, vulnerable sector check — uploaded once, confirmed by agencies, yours forever.

**Feature 2 — Icon: Star**
> A score built from real work
> Your reliability and care rating are verified by the agencies you've worked with — and the families you've cared for. Not self-reported. Not gameable.

**Feature 3 — Icon: Briefcase**
> Your work history. Not a resume.
> Every shift logged, every engagement rated, every reference named. A complete picture of who you are as a caregiver — built by the people who actually worked with you.

---

### How It Works

**Section label:** How it works

**H2:**
> Three steps. Ten minutes. Yours forever.

**Step 01:**
> Create your profile
> Tell us who you are, what you've done, and upload your credentials. Takes about 10 minutes.

**Step 02:**
> Agencies confirm your history
> Every agency you work with verifies your shift history and adds their rating. Over time, your profile becomes undeniable.

**Step 03:**
> Your reputation follows you
> One link. Share it with any agency. They see exactly who you are and what you've done. No more starting from zero.

---

### Social Proof

**Quote:**
> "I've been a PSW for 7 years. Every time I switched agencies, I lost everything — my standing, my references, my history. I had to prove myself from scratch every single time. This is the first thing that's actually for us."

**Attribution:**
> — Maria T., PSW, Ottawa

---

### For Agencies

**Section label:** For home care agencies

**H2:**
> Stop hiring blind. Start hiring proven.

**Body:**
> ReliantCare gives your agency a verified pool of pre-screened caregivers. You see real shift history, real reliability scores, and real feedback — before you make an offer. Our AI recruiting agent handles the screening and scheduling so you're not losing hours to phone tag.

**CTA (ghost button):**
> Agency? Get early access →

---

### FAQ

**Section label:** Questions

**Q1: Is this really free for caregivers?**
Yes. Caregivers get a free profile forever. No credit card, no tiered plan, no catch. Agencies pay for access to the recruiting and screening tools. That's how we keep it free for the people who need it most.

**Q2: How is my reputation verified?**
Your profile is built from data confirmed by the agencies you've worked with — not self-reported claims. The more agencies that confirm your history, the stronger your profile becomes.

**Q3: Who owns my data?**
You do. Your profile, your history, your ratings — all yours. You control what gets shared and with whom. We never sell your data.

**Q4: Does this work across different agencies?**
Yes. Your profile works with any agency on the platform — in any city. Move from Ottawa to Toronto, your reputation moves with you.

**Q5: When does this launch?**
We're building now. Early access opens to caregivers in Ontario first, then expands across Canada and into the US. Join the waitlist and we'll tell you first.

**Q6: What about my family's privacy?**
Family ratings are shared with your consent and are tied to your profile — not to the family's personal information. We don't store medical data, address, or anything beyond your caregiving history.

---

### Final CTA

**H2:**
> The industry's been asking for this for years.
> Be first.

**Button:** Build My Profile — It's Free

**Trust line:** 🔒 No credit card. No catch. Free forever.

---

### Footer

**Logo line:** ReliantCare
**Tagline:** Built for caregivers. Free forever.
**Copyright:** © 2026 ReliantCare Network. All rights reserved.

---

## 8. Quality Checklist

Before launch, verify:

- [ ] Page loads in under 2 seconds
- [ ] Mobile: looks great on iPhone SE (smallest common screen)
- [ ] All buttons and links work
- [ ] Email form validates and submits correctly
- [ ] Success state appears after submit
- [ ] FAQ accordion opens/closes correctly
- [ ] Nav becomes solid after scroll
- [ ] All fonts load correctly (Inter from Google Fonts)
- [ ] No layout shift on load (elements don't jump)
- [ ] OG meta tags set (title, description, image)
- [ ] Favicon set with ReliantCare logo
- [ ] Privacy policy page linked in footer
- [ ] "Built for caregivers. Free forever." visible in footer
