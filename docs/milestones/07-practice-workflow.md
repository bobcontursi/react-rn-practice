# Milestone 7 — Practice Workflow

## What's being built

A Contact page (`web/src/pages/Contact.tsx`, a `/contact` route, and a nav link) as the vehicle for rehearsing the full workflow: branch → PR → review → merge → promote → tag. The page itself is deliberately trivial. The point is the workflow, and I'm driving the git/GitHub steps myself. Every step is captured in a reference doc for later.

## Decisions

- **The feature is a throwaway-simple vehicle.** A static page following the existing `About` pattern keeps the diff small, so attention stays on the PR mechanics rather than the code.
- **A deliberate flaw to review.** The page hard-codes a plain-text email (`hello@example.com`, a placeholder rather than a real address, since the repo is public). That line is the target of the review comment in the PR step.
- **PRs into `dev`, gated on CI.** M6 protected `dev` and `main` with required status checks (`web-ci`, `mobile-ci`, `flags-server-ci`), so direct pushes are blocked and this milestone exercises that gate for real: `feature/contact-page` → PR → `dev`.
- **First real `dev` → `main` promotion.** M6 deliberately left the production deploy outcome to this milestone. Promoting `dev` to `main` is where `deploy-prod.yml` fires for real and the Vercel production deploy gets verified.
- **Stage deliberately, never `git add -A`.** `flags-server/flags.json` carries an unrelated local change (`betaBadge: true`) that must stay out of every commit in this milestone.
- **Local build before pushing.** `cd web && npm run build` (`tsc -b && vite build`) runs first. `noUnusedLocals` is on, so an import without a matching route fails the build, and it would fail CI too.

## Steps

1. Create branch `feature/contact-page`.
2. Add `Contact.tsx`.
3. Wire up the route in `App.tsx` and the nav link in `Layout.tsx`.
4. Write this spec, run the local build, stage only the intended files, commit, and push with upstream tracking.
5. Open a PR into `dev` and watch the CI checks run.
6. Leave a review comment on the plain-text email line and address it.
7. Merge the PR once CI is green.
8. Promote `dev` → `main` through a PR and confirm the production deploy.
9. Tag the release.

## Definition of done

- [x] `feature/contact-page` pushed, with `Contact.tsx`, the route, and the nav link.
- [x] Local `npm run build` passes.
- [x] PR #2 into `dev` opened; `web-ci`, `mobile-ci`, and `flags-server-ci` all pass.
- [x] Review comment left on the email line (fixed as a `mailto:` link in `597d9b5`) and resolved.
- [x] PR #2 merged into `dev` (merge commit `5c731cb`).
- [x] PR #3 (`dev` → `main`) merged as `ecf8f3e`; `deploy-prod.yml` ran successfully and the production site serves `/contact`.
- [x] Release tagged `v0.1.0` on `main`.
- [x] `flags-server/flags.json` change never committed.
- [x] Reference doc of the full workflow written for later reuse: `docs/git-workflow-reference.md`.
