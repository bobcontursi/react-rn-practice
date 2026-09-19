# Milestone 6 — GitHub Actions CI/CD

## What's being built

Two GitHub Actions workflows: `ci.yml` (a PR gate for `dev`/`main`) and `deploy-prod.yml` (fires on push to `main`, builds `web/`, and triggers a Vercel deploy).

## Decisions

- **Scoped to what M6 actually owns, not M7's.** Per the top-level spec, M7 is where the first real GitHub PR gets opened and `dev`→`main` genuinely merges. Every milestone so far has landed via local `git merge --ff-only`. M6 ships and verifies the two workflow files without front-running that — no real PR, no real `dev`→`main` merge here.
- **A real `workflow_dispatch` registration constraint, caught before implementation**: GitHub won't let you dispatch a workflow via API/CLI until it's been seen running at least once. Since `main` stays untouched and neither workflow's normal trigger (`pull_request`, `push: main`) would fire during M6's own work, `gh workflow run` would have 404'd with nothing to test. Fixed by giving both workflows a `push: branches: [dev]` trigger so the milestone's own bootstrap push registers and runs them for real:
  - `ci.yml` keeps this trigger **permanently** — CI running on every `dev` push too is harmless and reasonable.
  - `deploy-prod.yml`'s `dev` trigger is **temporary**, commented in the YAML, removed in a follow-up commit — this workflow's job is production deploys, so it shouldn't fire on every `dev` push forever.
- **The bootstrap push genuinely fires the Vercel Deploy Hook** — not simulated. Required setting up the hook + `VERCEL_DEPLOY_HOOK_URL` secret *before* pushing, or the curl step would fail on an empty URL and muddy whether the build step itself passed.
- **Per-app CI gates matched to what actually exists**, not invented: `web/` has real `lint`/`build` scripts (gets both); `mobile/` has no lint tooling configured (Expo's blank-typescript template doesn't set one up — not adding ESLint from scratch here), so its gate is `tsc --noEmit`; `flags-server/` is zero-dependency vanilla Node, so its gate is `node --check server.js`.
- **Deploy via Vercel Deploy Hook, not the full `vercel` CLI** — avoids `VERCEL_TOKEN`/`ORG_ID`/`PROJECT_ID` secrets and more moving parts, especially given how flaky this Vercel account's dashboard already proved in M5. Accepted trade-off: Vercel's own Git integration still auto-deploys on push to `main` too, so a real `main` push will trigger two deployments. Not worth the extra complexity to suppress.
- **`dev` gets branch protection for the first time**, matching `main`'s M5 config (0 required approvals — solo repo, GitHub won't allow self-approval; `enforce_admins: true`) plus the new `required_status_checks` naming all three `ci.yml` jobs. M7's rehearsal is specifically about PRs into `dev` being gated on CI, so this needed to happen now, not be left for M7 to discover missing.

## What shipped

- `.github/workflows/ci.yml` — `web-ci`, `mobile-ci`, `flags-server-ci` jobs.
- `.github/workflows/deploy-prod.yml` — build + Vercel Deploy Hook trigger.
- Branch protection on `dev` (new) and `main` (updated) requiring all three CI jobs.

## Verification performed

- Bootstrap push to `dev` fired both workflows for real (not a manual dispatch) — confirmed via `gh run list`/`gh run view` that all three `ci.yml` jobs passed and `deploy-prod.yml`'s build step passed and its curl step reached the hook successfully.
- Follow-up commit removed `deploy-prod.yml`'s temporary `dev` trigger; confirmed that push did *not* re-fire it (GitHub evaluates a push event against the workflow file version at the new HEAD).
- `gh api .../branches/main/protection` and `.../branches/dev/protection` confirmed `required_status_checks.contexts` lists all three job names on both branches.

## Definition of done

- [x] `ci.yml` and `deploy-prod.yml` written and passing.
- [x] Bootstrap push confirmed both workflows run successfully on real GitHub infrastructure.
- [x] Temporary `dev` trigger removed from `deploy-prod.yml` without re-firing it.
- [x] Branch protection with required status checks added to both `dev` and `main`.
- [ ] Real production deploy outcome (does `main` actually serve the app correctly) — deliberately not this milestone's job; that's M7's, once `dev`→`main` genuinely merges.
