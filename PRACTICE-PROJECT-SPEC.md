# React / React Native Practice Build — Spec

## Purpose

Closing a real, named gap ahead of the Aritzia hiring-manager round: hands-on fluency with React, React Native, Git-based workflows, and a real CI/CD pipeline, refreshed through a rudimentary but genuinely end-to-end build rather than passive review. This spec is meant to be dropped into a fresh project folder and handed to Claude Code / VS Code to execute against, one milestone at a time.

Ties to job-search task #34.

## Research correction before you build

You asked to confirm Aritzia uses React Native and publishes both iOS and Android versions. Checked both parts:

- **React Native: confirmed.** The Aritzia app calls `ota-update.mobile.services.aritzia.com/hot-updater/...` — `hot-updater` is a named open-source React Native OTA update library. That's a specific, unambiguous signal, not an inference.
- **iOS and Android: not accurate — it's iOS-only.** Aritzia's own launch coverage is explicit: *"The app is available exclusively for iOS in Canada and the U.S."* (WWD, Oct 22, 2025). There is no official Android release; a couple of Android listings that surface in search are unrelated (an unpublished third-party "Aritzia Store" app, and "The SET @ Aritzia," a fitness-studio booking app from a different vendor, not the retail app).

Practical effect on this spec: the mobile milestone below targets iOS only, which actually mirrors Aritzia's real platform decision rather than working around it. Worth having the "why iOS-only first" question in your back pocket for a conversation — common reasons brands do this: iOS skews toward the higher-spending customer segment in fashion/luxury retail, and shipping one platform well beats splitting a small mobile team across two from day one.

## Scope

**In scope:**
1. A browser-based React app with a few pages and working client-side routing.
2. An iOS app built with React Native, carrying the same core functionality/screens as the web app.
3. A Git repository with a real branching model.
4. Separate dev and prod environments for the web app, plus a GitHub Actions pipeline that promotes code from dev to prod.
5. A practiced, repeatable workflow for a code change → review → pull request → merge → deploy cycle, run for real against your own repo (not just described).

**Explicitly out of scope (kept rudimentary on purpose):**
- No real backend or database — a small local/mock JSON data source stands in for an API.
- No authentication.
- No App Store submission — running in the iOS Simulator (or your own iPhone via Expo Go) is sufficient; this is about the pipeline and the code, not shipping to the store.
- No production infrastructure spend — free tiers throughout (GitHub, Vercel/Netlify, Expo).
- No visual design polish — functional, plain styling is fine; the point is the architecture and process, not the UI.

## Tech stack, with rationale

| Layer | Choice | Why |
|---|---|---|
| Web app | Vite + React + TypeScript | Fastest modern React setup with minimal config; TypeScript matches the level of rigor expected at a Director/Sr. Director technical conversation and is a safe default in 2026 tooling. |
| Web routing | React Router | The standard for client-side routing in a plain React (non-Next.js) app. |
| Mobile app | React Native via **Expo** (managed workflow) | Expo removes most of the Xcode/CocoaPods ceremony while still teaching real RN concepts (components, navigation, styling, native modules). This is the pragmatic choice for a practice build — bare React Native CLI is not necessary to get genuine fluency. |
| Mobile navigation | React Navigation (stack navigator) | RN's standard navigation library — conceptually the same job as React Router, but worth being able to name it as a *different* library, since that's a real distinction interviewers sometimes probe. |
| Shared data | A small local JSON file or in-memory module, duplicated or shared via a lightweight shared package | Stands in for a commerce API without building a real backend; optional to formalize as a shared package (see Milestone 4). |
| Hosting (web, dev + prod) | Vercel or Netlify, two environments (preview/dev and production) | Free, trivial to wire into GitHub Actions, and mirrors a real dev→prod promotion flow. |
| CI/CD | GitHub Actions | Named explicitly in your own JD conversations; this is the one to actually get hands-on with. |

## Branching strategy: GitHub Flow, run with trunk-based discipline

Not a strict either/or between GitHub Flow and Trunk-Based Development — the more accurate (and more interview-credible) framing is that they answer different questions. GitHub Flow is the *mechanism*: every change gets a short branch and a pull request, reviewed, then merged to `main`. Trunk-Based Development is a *discipline* layered on top of any such mechanism: branches live hours, not days; changes are small; anything unfinished ships hidden behind a feature flag rather than parked on a long-lived branch. Running GitHub Flow with TBD's constraints gets both — the PR/review reps this project is specifically built to rehearse (Milestone 8), plus the DORA-aligned discipline (deployment frequency, low change failure rate) that's explicitly named in the JD and in the operational-metrics research notes already on file.

Concrete rules to actually hold to, so this is a practiced discipline and not just a label:
- Every change, however small, gets its own branch off `dev`, named `feature/<slug>`.
- A branch should merge back within a day; if it's taking longer, the change was too big and should have been split.
- Nothing sits half-finished on a branch waiting for "the right time to ship." If a change isn't ready for users yet, merge it anyway, hidden behind a feature flag — the code goes to production; the *feature* doesn't.

## Feature flags: build a minimal one, know the real ones by name

Same honest-scoping approach as everywhere else in this project: build a small custom flag mechanism rather than signing up for a third-party platform, since building one is what actually teaches how it works — but be ready to name and describe the real tools a team would reach for instead.

**What to build (folds into Milestone 4):**
- A `flags.json` (or a tiny SQLite/JSON-file-backed store) holding a handful of boolean flags, each with a name and an on/off state.
- A minimal internal toggle page — one route, no auth needed for a practice project — that reads and writes that store, so flags can be flipped without touching code or redeploying.
- Both the web app and the RN app read flag state from the same source at startup (or on a short poll), and conditionally render at least one thing based on a flag — enough to prove the mechanism works end to end, not just in theory.

**What real teams use instead, for the interview conversation:**
- Dedicated platforms: LaunchDarkly, Split, Optimizely Feature Experimentation, or open-source options like Unleash, Flagsmith, and GrowthBook. These provide an SDK-plus-dashboard architecture — an embedded SDK evaluates flag rules locally with caching, while a web dashboard lets non-engineers flip flags, dial rollout percentages, target segments, and see an audit log of who changed what and when.
- The category distinction worth naming precisely: release toggles (short-lived, hide unfinished features — what this project's own flag will be), ops toggles (kill switches), experiment toggles (A/B testing), and permission toggles (entitlements) — each with a different expected lifetime and cleanup discipline.
- The tech-debt discipline worth describing even without building it at scale: assign an owner and an expected removal date at creation time, open the cleanup ticket alongside the flag itself rather than after, and run recurring flag audits to catch anything stuck at 0% or 100% rollout that should have been deleted already.

## Milestones

Follow the same discipline as your other spec-driven practice project: write a short spec for the milestone in Plan Mode, get your own sign-off before implementing, build on a feature branch, and land the spec + code together.

### M1 — Repository and tooling setup
- `git init`, initial commit, `.gitignore` (Node/Vite/Expo defaults).
- Branch model: `main` (production), `dev` (integration). Feature branches cut from `dev` as `feature/<slug>` and merged back within a day — see Branching Strategy above for the reasoning.
- A root `README.md` describing the two apps and how to run each locally.
- (Optional but recommended) Enable branch protection on `main` in GitHub settings — requires a PR and passing checks before merge. This is a five-minute setting that makes Milestone 7/8 meaningfully realistic rather than cosmetic.

### M2 — Web app skeleton
- Scaffold with Vite (`npm create vite@latest`, React + TypeScript template).
- Three routed pages, enough to exercise real routing: a Home/landing page, a "detail" page (e.g., a mock product or profile page taking a URL param), and a third page of your choice (About, Settings — whatever's convenient).
- A shared layout component with nav links between the three pages.
- Runs locally with `npm run dev`.

### M3 — React Native (Expo) app skeleton
- Scaffold with `npx create-expo-app`.
- Port the same three screens into React Navigation's stack navigator — same content/purpose as the web pages, native-appropriate components (`View`, `Text`, `FlatList`, etc. instead of `div`/`ul`).
- Runs in the iOS Simulator via `npx expo start` (press `i`), or on your own iPhone with the Expo Go app.
- Deliberately not aiming for pixel parity with the web app — the goal is comparable functionality through the platform-idiomatic approach, which is the real skill being practiced.

### M4 — Shared mock data layer and feature flags
- A small JSON dataset (5–10 mock "items" is plenty) consumed by both the web detail page and the RN detail screen.
- Simplest version: duplicate the JSON file into each project. Stretch version: pull it into a small shared package (a local npm workspace or just a shared `/shared` folder each app imports from) — worth doing once, since "shared code between web and native" is a real architectural question you may get asked about directly.
- The minimal feature-flag mechanism described above — `flags.json` (or equivalent), a toggle page, and at least one conditional render in each app driven by it.

### M5 — Dev and prod environments (web)
- Two deploy targets on Vercel/Netlify: a preview/dev environment (deploys automatically on pushes to `dev`) and production (deploys only from `main`).
- `.env.development` / `.env.production` pattern for at least one environment-specific value, even something trivial (an environment label rendered in the footer), so the distinction is real and visible, not just configured.

### M6 — GitHub Actions CI/CD
- Workflow 1 (`ci.yml`): runs on every PR into `dev` or `main` — install, lint, build (and test, if you add any). This is the gate that has to pass before a merge is allowed.
- Workflow 2 (`deploy-prod.yml`): runs on push/merge to `main` — builds and deploys to the production hosting target.
- This is the literal dev → prod promotion pipeline you asked for: `feature/*` → PR into `dev` (CI runs) → merge to `dev` (deploys to the dev environment) → PR from `dev` into `main` (CI runs again) → merge to `main` (deploy-prod fires).

### M7 — Practiced workflow, run for real
Not a build task — a rehearsal, done against your own repo so it's muscle memory rather than theory:
1. Cut a feature branch, make a small real change (e.g., add a fourth page/screen, or tweak the mock data).
2. Open a pull request into `dev` with a real description.
3. Review your own PR as if you were a teammate — leave at least one review comment, then push a follow-up commit addressing it.
4. Watch the CI workflow run and pass on the PR.
5. Merge, watch the dev deploy fire, confirm it live.
6. Repeat the PR → review → merge motion one level up, from `dev` into `main`, and watch the production deploy fire.
7. Optional: tag the resulting commit as a release (`git tag v0.1.0`) to practice that convention too.

### M8 — Stretch, optional
Only if M1–M7 feel solid and you want more reps:
- A basic push-notification stub in the RN app (even a local notification, no real push service needed) — RN-specific concept with no web equivalent, useful to have touched.
- A short written note-to-self on how `hot-updater`-style OTA updates work conceptually (ship a new JS bundle without an App Store review) — you already have the real-world example from the Aritzia HAR research, so this is really just consolidating that into your own words.

## Bringing this into Claude Code / VS Code

1. Create a new project folder (this spec doesn't need to live inside an existing repo — treat it as day one of a new one).
2. `git init`, then save this file at the repo root as `PRACTICE-PROJECT-SPEC.md`.
3. Open the folder in VS Code / Claude Code.
4. Work milestone by milestone, in order — each one sets up context for the next (M3 leans on M2's page structure, M6 leans on M5's environments, M7 needs M1's branch protection to feel real).
5. For each milestone, ask Claude Code to draft a short milestone spec first (what's being built, any decisions worth recording), get your own sign-off, then implement on a `feature/<slug>` branch, and land the milestone spec + code together in one PR — same convention as your Shopify practice project.
