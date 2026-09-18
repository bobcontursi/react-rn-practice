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

## Verification — confirmed by you

- Web: toggle `betaBadge` at `/flags`, Home badge appears. Confirmed working end-to-end.
- Mobile: `EXPO_PUBLIC_FLAGS_SERVER_URL` set to the LAN IP in `mobile/.env`, RN Home screen picked up the same flag over Expo Go and showed the badge. Confirmed working end-to-end.
- **Root cause of the first "it's not working" report**: not a connectivity or ATS issue — the flag was simply toggled back to `false` on the server at the time of the mobile check, so neither app would have shown a badge regardless of platform. Diagnosed by querying `flags-server` directly (`curl http://192.168.86.184:4000/flags`) and seeing `{"betaBadge":false}`. Fixed by re-toggling the flag before reloading.
- Along the way, added `console.log`/`console.warn` diagnostics to `mobile/src/flags.ts` and `HomeScreen.tsx` (the original `catch` swallowed fetch errors silently, which made this harder to diagnose than it needed to be) — landed as its own small commit/branch rather than folded silently into this spec.

## Definition of done

- [x] `flags-server` built, CORS-correct, GET/POST/persist cycle verified.
- [x] Web: toggle page + Home badge wired, build clean, routes serve.
- [x] Mobile: flags client + Home badge wired, `tsc` clean, bundle smoke test clean.
- [x] `mobile/.env` gitignore behavior verified with `git check-ignore`.
- [x] README updated with flags-server + LAN-IP instructions.
- [x] Flag toggle confirmed end-to-end on both web and mobile (Expo Go, LAN IP).
