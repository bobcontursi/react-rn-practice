# Milestone 3 — React Native (Expo) app skeleton

## What's being built

The Expo (React Native) app under `/mobile`, porting the same three pages from the web app (M2) to native screens behind a stack navigator, using React Navigation instead of React Router.

## Decisions

- **Package manager pinned to npm** by invoking the scaffold via `npx create-expo-app` (npm-based invocation), matching `web/` — avoids a mixed-lockfile repo, relevant if M4 ever considers a shared workspace.
- **`--no-agents-md`** passed to the scaffold to skip Expo's generated `AGENTS.md`/`CLAUDE.md`/`.claude/settings.json` — this repo already has its own spec-driven convention (`PRACTICE-PROJECT-SPEC.md`, `docs/milestones/`), so generic scaffolded agent docs would just be unused noise.
- **Real app identity set in `app.json`**: `ios.bundleIdentifier: com.robertcontursi.rnpractice` and `scheme: rnpractice`, replacing Expo's placeholder — costs nothing now, avoids a cleanup step later for stable Expo Go/EAS linking. Easy to change later if a different identifier is wanted.
- **`@react-navigation/native` + `@react-navigation/native-stack`** (not the legacy JS-based `@react-navigation/stack`) — the current Expo-recommended default, installed via `npx expo install` for SDK-compatible versions.
- **Typed navigation, for real**: `mobile/src/navigation/types.ts` defines `RootStackParamList`; every screen is typed with `NativeStackScreenProps<RootStackParamList, '<ScreenName>'>`, so `route.params.id` on the detail screen is a real `string`, not `any`. Confirmed by `tsc` — see Verification.
- **No shared nav header/layout across screens.** RN stack navigation is push/back, not persistent-nav like the web's header bar — native-stack's built-in header + back button is the idiomatic fit; forcing a custom shared layout onto it would fight the platform instead of using it.
- **Mock data duplicated, not shared**, at `mobile/src/data/items.ts` (same shape as `web/src/data/items.ts`). M4 is explicitly where web/RN data sharing gets formalized — doing it now would be the premature abstraction M4 is scoped to address deliberately.
- **`react-native-gesture-handler` was not added.** Checked for it as the most likely failure point per the plan's contingency; bundling succeeded cleanly with no missing-module or gesture-related errors, so it wasn't needed for this version of `react-native-screens`/native-stack.

## Verification performed

- `npx tsc --noEmit` in `mobile/` — clean, no errors. Confirms the typed nav params actually type-check, not just that the file names look right.
- Metro started non-interactively (`npx expo start`, backgrounded), then `curl`'d `http://localhost:8081/index.bundle?platform=ios&dev=true` directly to force a real compile — returned `200` with a fully bundled JS payload covering all three screens, no red-screen/bundling error.
- Metro process explicitly killed afterward and port 8081 confirmed free (`lsof -ti:8081` empty) — no leftover background process to collide with your own `npx expo start` later.

## Verification NOT performed (required to close this milestone)

- **Actually running the app** — in the iOS Simulator (needs full Xcode; only Command Line Tools are present in this session, so `xcrun simctl` isn't available here) or via Expo Go on your own device (`npx expo start`, scan the QR code).
- This is tracked as an open item below, not assumed. "TypeScript compiled and Metro bundled" and "I navigated the three screens on my phone/simulator" are different, separately-verified claims.

## Definition of done

- [x] `mobile/` scaffolded (Expo, blank-typescript template, npm).
- [x] `app.json` updated with real bundle identifier + scheme.
- [x] React Navigation (native-stack) installed and wired with typed params.
- [x] Three screens (Home, ItemDetail, About) with native-idiomatic components (`FlatList`, `Pressable`, `View`/`Text`).
- [x] `tsc --noEmit` clean.
- [x] Metro bundling smoke test passed; process torn down cleanly.
- [ ] **You've run it on-device or in Simulator and clicked through all three screens.**
