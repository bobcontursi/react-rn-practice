# Milestone 2 — Web app skeleton

## What's being built

The Vite + React + TypeScript web app under `/web`, with three routed pages and a shared layout — the first real code in the repo, exercising React Router.

## Decisions

- **React Router v7** (installed as `react-router-dom`, which still works as the compatibility entry point) with `<BrowserRouter>` + `<Routes>` — the standard, idiomatic setup for a plain client-rendered SPA (no framework router needed here).
- **Mock item data lives locally** at `web/src/data/items.ts` — a small inline array, not yet shared with the RN app. M4 is explicitly where this gets formalized/duplicated or pulled into a shared package; doing that now would be premature.
- **Vite's default boilerplate removed** (counter demo, default CSS, hero/react/vite assets) and replaced with the app's own minimal, unstyled-but-functional layout — no visual design polish, per the top-level spec's explicit scope.
- **Layout uses `<Outlet />`** (React Router's nested-route pattern) rather than passing `children` manually, since it's the idiomatic way to share a layout across routes.

## Pages

1. `/` (`Home.tsx`) — landing copy + links to each mock item's detail page.
2. `/items/:id` (`ItemDetail.tsx`) — reads the `id` param, looks up the item, renders it or a not-found state with a link back.
3. `/about` (`About.tsx`) — static copy about the practice project, pointing back to the spec.

## Verification performed

- `npm install && npm run build` — TypeScript compiles, production build succeeds.
- `npm run preview` + `curl` against `/`, `/items/1`, `/about` — all returned `200`, confirming the SPA shell serves correctly for each route.
- **Not performed:** an actual browser click-through (no browser-automation tool available in this session). Run `npm run dev` in `web/` yourself to confirm the nav and routing feel right — the build/curl checks above only prove it compiles and serves, not that it's visually correct.

## Definition of done

- [x] `web/` scaffolded with Vite React-TS template.
- [x] `react-router-dom` installed and wired in `main.tsx`/`App.tsx`.
- [x] Three routed pages + shared `Layout` with nav.
- [x] Vite boilerplate removed.
- [x] Build + route smoke test pass.
- [ ] Manual browser verification (left to you — see above).
