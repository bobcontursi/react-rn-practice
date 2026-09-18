# Milestone 4 — Shared mock data layer and feature flags

## What's being built

Two things the spec bundles into one milestone: a decision on how `web/` and `mobile/`'s mock item data relates to each other, and the minimal feature-flag mechanism (a flag store, a toggle page, and a conditional render in each app).

## Decisions

- **Shared data: duplicated, not a shared package.** `web/src/data/items.ts` and `mobile/src/data/items.ts` stay as separate files with the same shape, kept in sync by hand. Converting to an npm-workspaces shared package was considered and explicitly declined — it would require Metro monorepo-resolution config (`watchFolders`/`nodeModulesPaths`) for a payoff the top-level spec itself frames as optional stretch, not required for this milestone.
- **Flag persistence: a tiny local `flags-server`, not a static file.** A committed JSON file can't be written from a browser, so it can't satisfy "flip flags without touching code or redeploying" — the actual point of this mechanism. `flags-server/server.js` is plain Node `http`/`fs`, zero npm dependencies, exposing `GET /flags` and `POST /flags`, backed by `flags-server/flags.json`.
- **CORS headers verified directly, not just asserted.** The `OPTIONS` preflight response carries all three headers a browser actually checks — `Access-Control-Allow-Origin`, `-Methods`, and `-Headers` — confirmed with a real preflight `curl` request during implementation (see Verification). `Allow-Origin` alone would have let `GET /flags` work while the toggle page's `POST` silently failed.
- **One toggle page total** (`web/src/pages/Flags.tsx`, route `/flags`), not duplicated on mobile — the spec's own phrasing ("a minimal internal toggle page") is singular. The RN app is a read-only consumer.
- **`mobile/.env` reachability confirmed, not assumed.** `git check-ignore -v mobile/.env mobile/.env.example` was run directly: the root `.gitignore`'s `.env` rule (from M1) correctly ignores `mobile/.env`, and `!.env.example` correctly un-ignores the example file. (Worth noting: `mobile/.gitignore`, the Expo scaffold's own file, only has a narrower `.env*.local` pattern — it's the *root* `.gitignore` doing the real work here.)

## What ships

- `flags-server/` — `server.js`, `flags.json` (`{ "betaBadge": false }`), `package.json` (`npm start`, default port 4000, overridable via `PORT`).
- `web/src/flags.ts` — `getFlags`/`setFlag`, pointed at `import.meta.env.VITE_FLAGS_SERVER_URL ?? 'http://localhost:4000'`.
- `web/src/pages/Flags.tsx` — the toggle page, wired at `/flags` in `App.tsx` and linked from `Layout.tsx`'s nav.
- `web/src/pages/Home.tsx` — fetches flags on mount, shows a "🔵 Beta" badge next to the title when `betaBadge` is true.
- `mobile/src/flags.ts` — same shape, pointed at `process.env.EXPO_PUBLIC_FLAGS_SERVER_URL ?? 'http://localhost:4000'`.
- `mobile/src/screens/HomeScreen.tsx` — fetches flags on mount inside a `try/catch` (falls back to `{ betaBadge: false }` on failure — a phone genuinely may not reach the server), shows the same badge concept in the title.
- `mobile/.env.example` — documents `EXPO_PUBLIC_FLAGS_SERVER_URL=http://<your-machine-LAN-IP>:4000`.
- README updated with flags-server run instructions and a LAN-IP note for the mobile app.

## Verification performed

- `flags-server`: started standalone, `curl GET /flags` (default `false`), `curl -i OPTIONS /flags` with real preflight headers (`Origin`, `Access-Control-Request-Method`, `Access-Control-Request-Headers`) — confirmed all three CORS response headers present — `curl POST /flags` to toggle `betaBadge` to `true`, confirmed the next `GET` reflected it, then reset back to `false` before committing, then killed the process and confirmed port 4000 free.
- `web/`: `npm run build` — clean. With `flags-server` running, `npm run preview` + `curl` on `/` and `/flags` both returned `200`.
- `mobile/`: `npx tsc --noEmit` — clean. Metro bundle smoke test run on port **8090** (not 8081 — your own `npx expo start` session from M3's manual verification was still running on 8081 and was deliberately left alone) via a direct bundle request; `200` with the new flags code present in the bundle. Smoke-test process killed afterward, port 8090 confirmed free; your 8081 session confirmed untouched throughout.

## Verification NOT performed (required to close this milestone)

- Actually flipping the flag in the browser at `/flags` and watching the Home badge appear.
- Setting `EXPO_PUBLIC_FLAGS_SERVER_URL` in `mobile/.env` to your machine's LAN IP and confirming the RN Home screen picks up the same flag over Expo Go.
  - **Order matters:** toggle the web flag first, *then* (re)launch or reload the RN app — `HomeScreen.tsx` only fetches on mount, there's no polling, so flipping the flag while the screen is already open won't visibly do anything until the next mount.
  - **If the RN badge never appears** even with the LAN IP set correctly, check iOS App Transport Security (blocks plain `http://`) before assuming the server's broken — Expo Go has historically been permissive here, so it's unlikely, but worth ruling out first. Either way the `try/catch` means it fails silently (no badge), not with a crash.

## Definition of done

- [x] `flags-server` built, CORS-correct, GET/POST/persist cycle verified.
- [x] Web: toggle page + Home badge wired, build clean, routes serve.
- [x] Mobile: flags client + Home badge wired, `tsc` clean, bundle smoke test clean.
- [x] `mobile/.env` gitignore behavior verified with `git check-ignore`.
- [x] README updated with flags-server + LAN-IP instructions.
- [ ] **You've confirmed the flag toggle end-to-end**: web toggle → Home badge appears; and separately, RN Home badge appears via Expo Go with `EXPO_PUBLIC_FLAGS_SERVER_URL` set to your LAN IP.
