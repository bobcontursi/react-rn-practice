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

## Deployment steps (manual — this session can't perform these)

1. Push to GitHub once you provide the remote URL.
2. In Vercel: "Add New Project" → import the repo → **set Root Directory to `web`** (this is a multi-app repo — web/mobile/flags-server are siblings, not one package at the repo root).
3. Confirm Vercel's "Production Branch" (Settings → Git) is `main` — that alone makes `main` deploy to Production and every other branch, including `dev`, deploy as a Preview automatically.
4. In Vercel's Environment Variables settings, set `VITE_APP_ENV` scoped to **Production** = `production` and **Preview** = `development`. Necessary because a standard `vite build` always defaults to production mode regardless of which branch triggered it — the committed `.env.*` files give correct local dev/build parity, but without this dashboard step, both Vercel environments would show "production" in the footer.
5. (Recommended, deferred from M1): enable branch protection on `main` in GitHub Settings → Branches, now that a remote exists.

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
- [ ] GitHub remote pushed.
- [ ] Vercel project created, Root Directory + Production Branch + per-environment `VITE_APP_ENV` configured.
- [ ] Both live URLs confirmed showing the correct environment label.
