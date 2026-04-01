# 07_BUILD_RATING_SYSTEM.md
# Build the trust scoring and rating engine.
# ReliantCareNetwork — Rating System

---

## Pre-flight

Read before writing any code:
- 00_AGENT_INSTRUCTIONS.md
- 01_PROJECT_CONTEXT.md

Admin dashboard must be built first (06_BUILD_ADMIN_DASHBOARD.md).

---

## Core Philosophy

Reputations are EARNED through real work — not portable.
Four sources, weighted by credibility:

| Source | Weight |
|--------|--------|
| Caregiver (self) | Lowest — baseline only |
| System (behavioural) | Medium — passive signals |
| Agency (employer) | High — confirmed relationship required |
| Platform admin | Highest — verified standards |

---

## Six Rating Categories

| Category | Weight |
|----------|--------|
| Professional reliability | CRITICAL |
| Human qualities | HIGH |
| Personal care and hygiene | HIGH |
| Beyond the call | BONUS only — never drags score down |
| Skills match and competency | HIGH |
| Communication and conduct | MEDIUM |

---

## Weighted Dimensions

| Dimension | Weight | Scored by |
|-----------|--------|-----------|
| Would re-engage | 5x | Agency only |
| Reliability | 5x | Agency only |
| Dignity and respect | 4x | Agency + Family |
| Specialty match | 4x | Agency only |
| Punctuality | 4x | Agency only |
| Warmth and friendliness | 3x | Agency + Family |
| Hygiene — personal | 3x | Agency + Family |
| Hygiene — client care | 3x | Family only |
| Communication — agency | 3x | Agency only |
| Patience | 3x | Agency + Family |
| Cultural sensitivity | 2x | Agency + Family |
| Communication — family | 2x | Family only |
| Initiative | Bonus | Agency + Family |
| Emotional support | Bonus | Family only |

---

## Database Schema for Ratings

```sql
-- Add to a new migration file

CREATE TABLE IF NOT EXISTS agency_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caregiver_id UUID REFERENCES caregivers(id),
  agency_id UUID REFERENCES agencies(id),
  engagement_start DATE NOT NULL,
  engagement_end DATE,
  engagement_confirmed BOOLEAN DEFAULT false,
  engagement_confirmed_at TIMESTAMPTZ,

  -- Professional reliability
  punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
  reliability INTEGER CHECK (reliability BETWEEN 1 AND 5),
  would_re_engage BOOLEAN,
  professional_conduct INTEGER CHECK (professional_conduct BETWEEN 1 AND 5),

  -- Human qualities
  warmth INTEGER CHECK (warmth BETWEEN 1 AND 5),
  dignity INTEGER CHECK (dignity BETWEEN 1 AND 5),
  patience INTEGER CHECK (patience BETWEEN 1 AND 5),

  -- Hygiene
  personal_hygiene INTEGER CHECK (personal_hygiene BETWEEN 1 AND 5),
  infection_control INTEGER CHECK (infection_control BETWEEN 1 AND 5),

  -- Skills match
  specialty_match INTEGER CHECK (specialty_match BETWEEN 1 AND 5),
  medical_awareness INTEGER CHECK (medical_awareness BETWEEN 1 AND 5),
  medication_handling INTEGER CHECK (medication_handling BETWEEN 1 AND 5),
  mobility_safety INTEGER CHECK (mobility_safety BETWEEN 1 AND 5),

  -- Communication
  communication_agency INTEGER CHECK (communication_agency BETWEEN 1 AND 5),
  cultural_sensitivity INTEGER CHECK (cultural_sensitivity BETWEEN 1 AND 5),
  boundaries INTEGER CHECK (boundaries BETWEEN 1 AND 5),

  -- Beyond the call (bonus)
  initiative BOOLEAN,
  family_communication BOOLEAN,
  problem_solving BOOLEAN,
  continuity BOOLEAN,
  beyond_other TEXT,

  -- Review text
  review_text TEXT CHECK (char_length(review_text) BETWEEN 0 AND 2000),

  -- Meta
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'published', 'flagged', 'removed')),
  outlier_flagged BOOLEAN DEFAULT false,
  dispute_open BOOLEAN DEFAULT false,
  admin_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_reviews_caregiver ON agency_reviews(caregiver_id);
CREATE INDEX idx_reviews_agency ON agency_reviews(agency_id);
CREATE INDEX idx_reviews_status ON agency_reviews(status);
```

---

## Trust Score Calculation

```typescript
// lib/scoring/calculateTrustScore.ts

interface ReviewDimension {
  value: number | boolean
  weight: number
  type: 'scale' | 'binary' | 'bonus'
}

export async function calculateTrustScore(
  caregiverId: string
): Promise<number> {
  // 1. Fetch all published reviews
  const reviews = await db
    .select()
    .from(agencyReviews)
    .where(
      and(
        eq(agencyReviews.caregiverId, caregiverId),
        eq(agencyReviews.status, 'published')
      )
    )

  if (reviews.length === 0) return 0

  let totalWeightedScore = 0
  let totalWeight = 0
  let bonusPoints = 0

  for (const review of reviews) {
    // Apply source credibility weight
    const sourceWeight = await getAgencyCredibilityWeight(review.agencyId)

    // Apply recency decay (scores older than 2 years decay)
    const recencyWeight = getRecencyWeight(review.createdAt)

    const reviewWeight = sourceWeight * recencyWeight

    // Weighted dimensions
    const dimensions: ReviewDimension[] = [
      { value: review.wouldReEngage ? 5 : 1, weight: 5, type: 'binary' },
      { value: review.reliability, weight: 5, type: 'scale' },
      { value: review.dignity, weight: 4, type: 'scale' },
      { value: review.specialtyMatch, weight: 4, type: 'scale' },
      { value: review.punctuality, weight: 4, type: 'scale' },
      { value: review.warmth, weight: 3, type: 'scale' },
      { value: review.personalHygiene, weight: 3, type: 'scale' },
      { value: review.communicationAgency, weight: 3, type: 'scale' },
      { value: review.patience, weight: 3, type: 'scale' },
      { value: review.culturalSensitivity, weight: 2, type: 'scale' },
    ]

    for (const dim of dimensions) {
      if (dim.value !== null && dim.value !== undefined) {
        totalWeightedScore += (dim.value as number) * dim.weight * reviewWeight
        totalWeight += dim.weight * reviewWeight
      }
    }

    // Bonus points (never drag score down)
    if (review.initiative) bonusPoints += 0.05
    if (review.familyCommunication) bonusPoints += 0.05
    if (review.problemSolving) bonusPoints += 0.05
    if (review.continuity) bonusPoints += 0.05
  }

  if (totalWeight === 0) return 0

  // Normalise to 0–5.0 scale
  const baseScore = totalWeightedScore / totalWeight
  const finalScore = Math.min(5.0, baseScore + bonusPoints)

  // Check for outliers and down-weight
  const adjustedScore = await applyOutlierProtection(caregiverId, finalScore, reviews)

  // Store the score
  await db.update(caregivers)
    .set({ score: adjustedScore })
    .where(eq(caregivers.id, caregiverId))

  // Check badge thresholds
  await evaluateBadges(caregiverId, reviews)

  return adjustedScore
}

function getRecencyWeight(createdAt: Date): number {
  const ageInYears = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)
  if (ageInYears <= 1) return 1.0
  if (ageInYears <= 2) return 0.85
  if (ageInYears <= 3) return 0.65
  return 0.5
}
```

---

## Caregiver Protections — Enforce in Code

1. Agency can only submit a review after confirming
   engagement dates. Gate the review form behind this check.

2. Statistical outlier protection:
   Any score deviating more than 2 standard deviations
   from the caregiver's average is auto-flagged for admin review.
   Never auto-removed — always admin decision.

3. Caregivers see dimension scores in aggregate only.
   Never which specific agency gave which score.

4. Dispute path: caregiver can flag any score.
   Goes to admin queue. 14-day window after review published.

5. No public negative scores.
   Only positive signals and earned badges are publicly visible.
   Detailed scores visible to agencies only.

6. Source credibility: long-standing verified agencies
   carry more weight than new accounts.

---

## Badges — Auto-awarded

```typescript
// lib/scoring/evaluateBadges.ts

export async function evaluateBadges(
  caregiverId: string,
  reviews: AgencyReview[]
) {
  const badges: string[] = []

  // Consistently Reliable
  const reEngageYes = reviews.filter(r => r.wouldReEngage === true)
  const uniqueAgencies = new Set(reEngageYes.map(r => r.agencyId))
  if (reEngageYes.length >= 5 && uniqueAgencies.size >= 3) {
    badges.push('consistently_reliable')
  }

  // Above and Beyond
  const initiativeCount = reviews.filter(r => r.initiative).length
  const uniqueInitiativeAgencies = new Set(
    reviews.filter(r => r.initiative).map(r => r.agencyId)
  )
  if (uniqueInitiativeAgencies.size >= 3) {
    badges.push('above_and_beyond')
  }

  // Dementia Specialist
  const dementiaHigh = reviews.filter(
    r => r.specialtyMatch >= 4
  )
  const dementiaAgencies = new Set(dementiaHigh.map(r => r.agencyId))
  if (dementiaAgencies.size >= 2) {
    badges.push('dementia_specialist')
  }

  // Trusted Veteran (3+ years, consistently high)
  const avgScore = reviews.reduce((sum, r) =>
    sum + (r.reliability || 0), 0) / reviews.length
  const accountAge = await getAccountAgeInYears(caregiverId)
  if (accountAge >= 3 && avgScore >= 4.0) {
    badges.push('trusted_veteran')
  }

  // Highly Communicative
  const commScores = reviews
    .map(r => r.communicationAgency)
    .filter(Boolean) as number[]
  const avgComm = commScores.reduce((a, b) => a + b, 0) / commScores.length
  if (avgComm >= 4.5 && commScores.length >= 5) {
    badges.push('highly_communicative')
  }

  // Update badges in database
  await db.update(caregivers)
    .set({ badges: badges })
    .where(eq(caregivers.id, caregiverId))
}
```

---

## Agency Rating Form — Build Notes

Form unlocks only after:
1. Agency confirms they employed this caregiver
2. Agency provides engagement start and end dates
3. System validates the engagement

Form steps:
1. Confirm engagement (dates, hours, care type)
2. Professional reliability
3. Human qualities
4. Hygiene
5. Skills match
6. Communication
7. Beyond the call (binary yes/no + optional text)
8. Would re-engage (prominent, required, binary)
9. Review text (optional, 50–500 words)

After submission:
- 10% of reviews go to admin spot-check queue
- Outlier check runs automatically
- Score recalculates immediately
- Caregiver notified (aggregate only — no agency identified)
- 14-day dispute window opens

---

## Commit Sequence

```
feat: rating system — database schema for reviews
feat: rating system — trust score calculation engine
feat: rating system — badge evaluation logic
feat: rating system — agency review form with engagement gate
feat: rating system — caregiver protections and dispute path
```

---

*Last updated: March 2026 — ReliantCareNetwork*
