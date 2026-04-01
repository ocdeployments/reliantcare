# 09_MAINTENANCE.md
# Ongoing maintenance schedule and standards.
# ReliantCareNetwork — Maintenance

---

## The Rule

A product is never finished.
It is either actively maintained or actively decaying.

---

## Daily

```bash
# Start of every active development day
git pull origin main
pnpm install
npx supabase db diff     # check for pending migrations

# End of every day
git status               # nothing uncommitted unintentionally
git push origin [branch] # never leave work only on local machine
```

- Check Sentry for new errors from last 24 hours
- Review any failed CI runs on GitHub Actions
- Remove any console.log statements added during debugging
- Never end a day with a broken build

---

## Weekly

```bash
pnpm audit               # check for security vulnerabilities
pnpm build               # check bundle size
git branch --merged      # delete merged branches
```

- Review Sentry error trends
- Review Vercel Analytics for performance regressions
- Check Supabase dashboard for slow queries
- Check storage usage growth
- Review Clerk dashboard for auth anomalies
- Review any new profile submissions in admin queue

---

## Monthly

```bash
pnpm outdated            # see what needs updating
pnpm update              # update patch and minor versions
```

Dependency update rules:
- Patch (1.0.x) — update freely
- Minor (1.x.0) — read changelog first
- Major (x.0.0) — plan carefully, never auto-update
- Never update more than 3 dependencies in one commit
- Run full test suite after any dependency update
- Never update locked versions (Tailwind, shadcn, Clerk)
  without explicit decision

Monthly checks:
- [ ] Run full Lighthouse audit on all key pages
- [ ] Compare scores against last month
- [ ] Review Core Web Vitals in Vercel Analytics
- [ ] API response times — flag anything over 500ms
- [ ] Rotate any overdue API keys
- [ ] Review Supabase RLS — any new tables without policies?
- [ ] Review Posthog funnels — where are users dropping off?
- [ ] Review LogRocket sessions — what are users struggling with?

---

## Quarterly

- Review all dependencies for active maintenance
- Remove packages no longer maintained
- Architecture review — is schema still appropriate?
- Review and update AGENT.md with new best practices
- Legal review — does privacy policy reflect actual data usage?
- Test database restoration from backup
- Verify all environment variables are documented securely

---

## Database Maintenance

Run monthly in Supabase SQL editor:

```sql
-- Check table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Clean up expired reference tokens
DELETE FROM caregiver_references
WHERE token_expires_at < NOW()
AND consent_given = false;

-- Mark stale draft profiles as abandoned
UPDATE caregivers
SET status = 'abandoned'
WHERE status = 'draft'
AND updated_at < NOW() - INTERVAL '90 days';
```

---

## Alert Thresholds

Get notified immediately when:
- Site down for more than 2 minutes
- Error rate above 1% of requests
- Database response time exceeds 1 second
- Storage usage exceeds 80% of plan limit
- Any new Critical Sentry error
- Failed deployment on main branch
- Auth failure rate spikes (possible attack)

---

## Stats to Verify Annually

These statistics are used in marketing copy.
Verify they are still current once per year:

- 75% annual caregiver turnover — Activated Insights
- 4 in 5 leave within first 100 days — HCAOA
- 9.7M care jobs to fill by 2034 — PHI

Replace with updated figures when new research is published.
Never use statistics that are more than 3 years old.

---

## DECISIONS.md — Keep Updated

Every major architectural or product decision goes here.
Format:

```markdown
## Decision: [short title]
Date: YYYY-MM-DD
Status: Accepted / Superseded / Deprecated

### Context
What situation led to this decision?

### Decision
What did we decide?

### Consequences
What trade-offs did we accept?
```

This file is one of the most valuable in the project.
When you return to a decision 6 months later wondering
"why did we do it this way?" — the answer is here.

---

*Last updated: March 2026 — ReliantCareNetwork*
