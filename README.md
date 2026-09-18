# React / React Native Practice Build

A small, spec-driven practice project for hands-on React, React Native, and CI/CD skill-building. See [PRACTICE-PROJECT-SPEC.md](./PRACTICE-PROJECT-SPEC.md) for the full milestone roadmap and rationale, and [docs/milestones/](./docs/milestones/) for each milestone's own spec.

## Structure

- `/web` — Vite + React + TypeScript app (added in M2).
- `/mobile` — Expo (React Native) app (added in M3).
- `/flags-server` — tiny local Node server backing the feature-flag mechanism (added in M4).

## Running locally

- Feature-flag server (needed for the flags toggle page and either app's flag-driven badge): `cd flags-server && npm start` — listens on `http://localhost:4000`.
- Web app: `cd web && npm install && npm run dev`
- Mobile app: `cd mobile && npm install && npx expo start` — press `i` for the iOS Simulator (requires full Xcode) or scan the QR code with Expo Go on your phone. To reach the flags-server from a physical device, copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_FLAGS_SERVER_URL` to your machine's LAN IP (not `localhost` — that means the phone itself).

## Branch model

- `main` — production. Only updated via a reviewed PR from `dev`.
- `dev` — integration branch. All feature branches target this.
- `feature/<slug>` — cut from `dev` for every change, however small; merged back within a day (see the spec's Branching Strategy section).
