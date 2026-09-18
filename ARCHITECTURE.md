# Architecture

See `README.md` first for the high-level overview. This file goes deeper into *why* things are
built the way they are, so a new agent doesn't re-litigate settled decisions.

## Why one Expo codebase instead of separate web + mobile projects

The project originally had `apps/web` (Next.js) and `apps/mobile` (bare React Native CLI) as two
separate frontends styled to look alike. The user explicitly rejected that: **"ikkisi bitta
frontendda bulish kerak"** (both must be in one frontend). The fix was to rebuild `apps/mobile` as
an **Expo** app and add `react-native-web`, then delete `apps/web` entirely. Now:

- `npx expo start --web` / `npx expo export -p web` → the web app
- `npx expo start` + Expo Go / a dev build → the Android/iOS app

Same React components, same styles, same navigation — zero duplication. When adding a new
screen or feature, there is only ever one place to write it.

## Backend

Single Express app (`apps/api`) with **one PostgreSQL database** shared by web and mobile
clients (there is no separate backend per platform). Auth is JWT (access + refresh), issued on
signup/login, sent as `Authorization: Bearer <token>`, verified by `requireAuth` middleware
(`apps/api/src/auth/middleware.ts`). Role-based access via `requireRole('organization' | 'admin')`.

`apps/api` runs via `tsx` (ts-node style, no `tsc` build step) in **both** dev and production —
this was a deliberate simplification after a compiled-JS + `@sinity/shared`'s TS source caused
`ERR_MODULE_NOT_FOUND` in production (Node couldn't `require()` a `.ts` file). Running the same
`tsx src/server.ts` command everywhere avoids that whole class of build/runtime mismatch.

### Data model (Prisma, `apps/api/prisma/schema.prisma`)

- `User` (`individual` | `organization` | `admin`) ↔ `OrganizationProfile` (business number,
  org name, address) for organization accounts.
- `Category` — community post categories, admin-manageable.
- `Post`, `Comment`, `Like`, `Report` (post/comment reports) — the community feature.
- `Listing` (`job` | `health` | `education`) — organization-authored listings, with optional
  lat/lng for a future map integration.
- `AdRequest` — organizations submit ads; admin approves/rejects; approval creates a
  `Notification` for the org.
- `PartnerCompany` — admin-curated partner directory entries.
- `Notification` — in-app notifications (comment replies, ad approval/rejection); no push
  delivery is wired up yet (planned: Firebase Cloud Messaging).
- `AdminSetting` — free-form key/value store for site settings.

All API error `message` strings must be **Korean** (see README's "known decisions" — this was
fixed once already after an Uzbek string leaked into a production error toast).

## Frontend structure (`apps/mobile`)

- **Navigation**: one root `Stack.Navigator` (`App.tsx`) containing `Splash`, `Login`, `Signup`,
  `Main` (a `createBottomTabNavigator` with Home/Services/Community/MyPage), plus `PostDetail`
  and `NewPost` pushed on top of `Main` for the community flow. See README's "Navigation
  structure" for the Signup-is-root detail.
- **Auth**: `src/context/AuthContext.tsx` holds the current user + loading state, persists the
  JWT in `@react-native-async-storage/async-storage` (works on web too, backed by
  `localStorage`).
- **API client**: `src/lib/api.ts` wraps `packages/shared`'s `ApiClient` with a platform-aware
  base URL — Android emulator needs `10.0.2.2` instead of `localhost`; production web build reads
  `EXPO_PUBLIC_API_URL` (baked in at build time, see `DEPLOYMENT.md`).
- **Design tokens**: `src/theme.ts` — `navy` (`rgb(24, 47, 83)`, used as the Home screen and
  auth-screen brand color), `brand` (blue, buttons/links), `accent` (green), `gray`, `border`,
  `white`. Change colors here, not by hardcoding hex values in screens.
- **Icons**: see README's "Icon system" section — `@expo/vector-icons` only, never hand-drawn
  SVG paths.

## Deployment model (summary — full detail in `DEPLOYMENT.md`)

`git push` to `main` → GitHub Actions SSHes into the one VPS that also hosts unrelated client
projects (`ETcomp`, `et-company-web`) → `git pull` inside `/opt/sinity` → rebuilds the API's
Prisma client + runs migrations → restarts the `sinity-api` PM2 process → rebuilds the static web
export → copies it into `/var/www/sinity-web`, served by nginx on port **8090** (chosen because
80/443/8080/3000/3001 were already taken by the other projects on that box). No domain is
configured for Sinity yet; access is by IP:port. This is explicitly a **staging/demo
environment for team review before a Play Store release**, not the production Play Store build
pipeline (that will need EAS Build + a signed AAB later).
