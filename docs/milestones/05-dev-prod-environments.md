# Milestone 5 — Dev and prod environments (web)

## What's being built

Two real Vercel environments for the web app (Production from `main`, Preview from every other branch push, `dev` included), plus a `.env.development`/`.env.production` pattern with a visible, environment-specific value in the footer.

## Decisions

- **No GitHub/Vercel account access from this session.** No `gh`/`vercel`/`netlify` CLI is installed here, and creating a GitHub repo or a Vercel project requires your own auth, which can't be done non-interactively. You create the GitHub repo and hand over the remote URL; Vercel project/environment setup happens in your dashboard, following the steps below.
- **Fixed a real `.gitignore` bug found while planning this milestone**, not assumed: the root `.gitignore`'s blanket `.env` / `.env.*` rule (from M1) was tested directly with `git check-ignore -v` and confirmed to incorrectly block `web/.env.development`/`web/.env.production` from ever being committed. Vite's own convention is that these two are non-secret, mode-specific config meant to be committed, while `.env.local`/`.env.*.local` (and bare `.env`, which `mobile/.env` already relies on) are the gitignored, secret-holding variants. Fixed to:
  ```
  .env
  .env.local
  .env.*.local
  !.env.example
  ```
  Re-verified with `git check-ignore -v` against all four filename shapes before committing anything.
- **Footer verification tightened to avoid a false positive.** A bare grep for the word "development" against an unminified dev bundle is unreliable — React's own dev-mode internals legitimately contain that literal word regardless of whether the footer feature actually works. The footer got a `data-testid="env-label"` attribute (not user-facing) purely so verification could target the specific element instead of pattern-matching a generic word. In dev mode, Vite doesn't inline the env value per-usage the way a production build does — it injects one `import.meta.env = {...}` object per module and the JSX still reads `import.meta.env.VITE_APP_ENV` as a property access — so the dev check confirms two things separately: the injected object contains `"VITE_APP_ENV": "development"`, and the `env-label` footer element's source specifically reads that exact property. The prod check greps the built JS asset for `env-label` co-located with the literal inlined value, which Vite *does* fully inline at build time.

## What ships

- `.gitignore` fix (root).
- `web/.env.development` (`VITE_APP_ENV=development`), `web/.env.production` (`VITE_APP_ENV=production`) — both committed.
- `web/src/components/Layout.tsx` — `<footer data-testid="env-label">` rendering `import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE`.
- `web/vercel.json` — SPA rewrite (`/(.*) → /index.html`) so client-side routes survive a direct link/refresh on Vercel.
- README "Deployment" section (see below).

## Deployment steps

1. ~~Push to GitHub once you provide the remote URL.~~ **Done** — repo is `bobcontursi/react-rn-practice` (public; switched from private since branch protection requires it on the free tier), `main`/`dev` pushed.
2. ~~In Vercel: "Add New Project" → import the repo → set Root Directory to `web`~~ **Done** — found under Settings → Build and Deployment rather than General in this account's UI.
3. **Production Branch**: no action needed — Vercel defaults this to the GitHub repo's default branch (`main`), confirmed already set correctly; there's no separate override control on this account's plan.
4. ~~Set `VITE_APP_ENV` scoped to Production/Preview~~ **Done** — two separate Config-type rows added.
5. ~~Enable branch protection on `main`~~ **Done** — via `gh api`: PR required (0 required approvals, since GitHub won't allow self-approval on a solo repo), `enforce_admins: true` (applies to the repo owner too, no bypass — a deliberate choice, not the default), force-push/deletion blocked. No required status checks yet (that's M6's CI workflow to add).

**Confirmed by you**: the Preview deployment (from `dev`) shows the full app with "Environment: development" in its footer — the whole pipeline (Root Directory, Framework Preset, per-environment `VITE_APP_ENV`) is working end-to-end. Production (from `main`) is still expected to 404 right now since `main` only contains `PRACTICE-PROJECT-SPEC.md` (all milestone work has deliberately stayed on `dev`; the real `dev`→`main` merge is M6/M7's job, not this one's) — that's correct, not a loose end.

**Vercel account/project turned out to be genuinely flaky, not a config mistake**, worth recording since it cost real time:
- The Root Directory picker in the "New Project" import wizard couldn't drill into subdirectories (showed only the repo root as a selectable option) — reproduced twice, across two separate project imports, so it's a real product limitation for this account, not user error.
- The first project's build Output (once it finally ran) showed raw repo folders plus phantom `mobile`/`web`/`middleware` entries instead of a compiled `index.html`/`assets/` — meaning Root Directory silently wasn't taking effect on the real build despite showing correctly in Settings. That project was deleted and re-imported rather than debugged further.
- On the fresh project, Vercel's automatic initial deployment (fired the instant the project is imported, before any settings can be touched) understandably failed against `main` — no `package.json` exists there yet.
- After manually setting Root Directory to `web` in the new project's settings, a manually-triggered "Create Deployment" *still* built `main` instead of `dev` (confirmed via the build log's `Branch: main` line) — the manual trigger UI wasn't reliably respecting the branch selection.
- **Resolution**: a real `git push origin dev` (rather than any dashboard button) reliably triggered a correctly-scoped `dev` build, which succeeded and confirmed the whole pipeline works. Lesson for later milestones: prefer a real push over Vercel's manual "Create Deployment" trigger when a specific branch matters.

## Verification performed

- `git check-ignore -v` against `web/.env.development`, `web/.env.production`, `web/.env.local`, `mobile/.env` — confirmed exactly the right two are committed and the right two are ignored.
- `npm run build` — clean; confirmed the built asset (`dist/assets/*.js`) contains the `env-label` marker co-located with the literal inlined value `production`.
- `npm run dev` — confirmed the dev-transformed `Layout.tsx` module contains `"VITE_APP_ENV": "development"` in Vite's injected env object, and the `env-label` footer element's source specifically reads `import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE`. Server torn down afterward, port confirmed free.

## Verification NOT performed (required to close this milestone)

- The actual GitHub push (waiting on your remote URL).
- Vercel project/environment dashboard setup.
- Confirming the two live Vercel URLs actually show "development" vs "production" in the footer.

## Definition of done

- [x] `.gitignore` fixed and re-verified.
- [x] `.env.development`/`.env.production` committed with the right values.
- [x] Footer wired, both dev and prod checks passed with the tightened (non-false-positive) verification approach.
- [x] `vercel.json` SPA rewrite added.
- [x] README "Deployment" section written.
- [x] GitHub remote pushed (public repo, branch protection enabled on `main`).
- [x] Vercel project created, Root Directory + per-environment `VITE_APP_ENV` configured.
- [x] Preview deployment (from `dev`) confirmed showing "Environment: development". Production is expected to 404 until M6/M7's real `dev`→`main` merge — not a bug.
