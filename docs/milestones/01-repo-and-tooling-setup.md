# Milestone 1 — Repository and tooling setup

## What's being built

The repo mechanics every later milestone depends on: a `.gitignore` covering Node/Vite/Expo, a root `README.md` describing the two planned apps and the branch model, and the `main`/`dev` branch split itself.

## Decisions

- **Local-only for now.** No GitHub remote is created in this milestone. Vercel/Netlify and GitHub Actions don't arrive until M5/M6, and the real PR-review rehearsal is explicitly M7's job once a remote and CI exist — creating a remote earlier would be scaffolding with nothing to exercise it.
- **Branch protection on `main` (listed as optional in the spec) is deferred**, not skipped — it needs a GitHub remote to mean anything, so it's revisited once M5/M6 wire one up.
- **`dev` becomes the active integration branch starting now.** `main` is left exactly as it was (just the spec commit) after this milestone. The `dev` → `main` promotion is the thing M5–M7 are specifically built to practice, so M1 doesn't pre-empt it with a mechanical merge.
- **README run instructions are placeholders**, not invented commands — neither app exists yet (that's M2 for web, M3 for RN).

## Definition of done

- [x] `.gitignore` covers `node_modules/`, build output, Expo caches, env files, OS/editor cruft.
- [x] `README.md` states repo purpose, planned `/web` + `/mobile` structure, and the `main`/`dev`/`feature/<slug>` branch model.
- [x] `dev` branch exists, created from `main`.
- [x] Work landed via `feature/repo-setup` branched from `dev`, merged back into `dev`.
- [x] `main` unchanged — still only the spec commit.
