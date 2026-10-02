# 시니티 (Sinity) — Senior Integrated Info Platform

> **For AI agents / new contributors (Codex, Claude, Cursor, etc.):** read this file, then
> [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`DEPLOYMENT.md`](./DEPLOYMENT.md) before making changes.
> They contain the decisions and exact commands needed to work on this repo without re-deriving them.

A Korean-language platform for senior citizens: job/welfare/health/education listings, a
community board, organization (institution) accounts, and an admin panel. Primary user language
in the UI is **Korean**; the human maintainer communicates in **Uzbek**; code comments are a mix
of Uzbek (explaining *why*) and plain code.

## Repository

- GitHub: https://github.com/UsmanSNT/sinitiy
- Default branch: `main` — every push to `main` auto-deploys (see `DEPLOYMENT.md`).
- Live preview: **http://49.247.205.179:8090** (staging/demo server, no domain yet, not the
  Play Store build).

## Tech stack (single codebase for web + mobile)

- **`apps/mobile`** — the *only* frontend. Built with **Expo (React Native + react-native-web)**.
  The exact same React components render as:
  - a **web app** (`npx expo start --web` in dev, `npx expo export -p web` for production —
    served as a static site by nginx), and
  - a **native Android/iOS app** (via Expo Go in dev, or a future EAS build for Play Store).
  There is **no separate Next.js/web project** — an earlier `apps/web` (Next.js) was deleted on
  purpose because the user wants one frontend, not two.
- **`apps/api`** — Node.js + Express + Prisma ORM + PostgreSQL. Plain REST API, JWT auth.
  Runs via `tsx` directly (no compiled JS step) both in dev and in production.
- **`packages/shared`** — TypeScript types, zod validation schemas, and a platform-agnostic
  `ApiClient` (plain `fetch`) shared between the API's expectations and the mobile app's client
  code. Consumed by `apps/mobile` via `"@sinity/shared": "file:../../packages/shared"` (see
  "Package manager split" below — **not** `workspace:*`).

### Package manager split (important, non-obvious)

- Root workspace (`pnpm-workspace.yaml`) only includes `apps/api` and `packages/*`, managed with
  **pnpm**.
- `apps/mobile` is **deliberately excluded** from the pnpm workspace and uses **plain npm**
  instead. Reason: pnpm's non-flat `node_modules` broke React Native / Expo's autolinking and
  Metro's module resolution (native modules like `react-native-svg`, Android Gradle plugin
  lookups, etc. failed). Do not move `apps/mobile` back into the pnpm workspace without solving
  that first.
- Because of the split, `apps/mobile/package.json` depends on the shared package via
  `"file:../../packages/shared"`, which npm turns into a symlink. Metro is configured
  (`apps/mobile/metro.config.js`) with `watchFolders` pointing at the monorepo root and
  `unstable_enableSymlinks: true` so it can resolve across that symlink.

## Local development

```bash
# 1. Postgres (local dev):
#    createdb + a role, or run one via Docker:
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres

# 2. API
cd apps/api
cp .env.example .env   # fill DATABASE_URL, JWT secrets
pnpm install            # from repo root also works
npx prisma migrate dev
npx tsx prisma/seed.ts  # categories, partner companies, sample orgs + listings (re-created each run)
npx tsx watch src/server.ts   # http://localhost:4000
# Admin accounts can't sign up in the app; promote an existing account:
npx tsx prisma/make-admin.ts <email>
# Optional: EXPO_PUSH_URL=http://127.0.0.1:4999/send points push at a fake Expo server for tests.
# Uploaded photos land in apps/api/uploads/ (gitignored).

# 3. Mobile app (web preview)
cd apps/mobile
npm install
npx expo start --web --port 3001   # http://localhost:3001

# 3b. Mobile app (Android, via Expo Go or emulator)
npx expo start           # then scan QR / press "a" for Android
# Android emulator reaches the API at 10.0.2.2:4000 automatically
# (see apps/mobile/src/lib/api.ts — platform-aware base URL)
```

Test account (exists in both local and production DB):

```
email: test@test.com
password: 123456
```

## Project structure

```
apps/
  api/                  Express API (JWT, Prisma, PostgreSQL)
    src/routes/         one file per resource (auth, me, posts, comments, likes, reports,
                        listings, ad-requests, notifications, partners, feed, uploads, admin, ...)
    src/push.ts         sendPush(): Expo Push Service client honouring per-user settings
    prisma/schema.prisma, prisma/seed.ts, prisma/make-admin.ts
  mobile/               Expo app — THE frontend (web + Android + iOS from one codebase)
    App.tsx             React Navigation root: one Stack of ~30 screens + notification-tap routing
    src/navigation/     Stack + bottom tab param types and the MainTabs component
    src/screens/        one screen per route (public lists/details, community, My*/Admin* screens)
    src/components/     shared UI (SearchBar, ListState, RegionPicker, OptionSheet, BottomNav, ...)
    src/context/        AuthContext (token in AsyncStorage, current user, push-token lifecycle)
    src/lib/            api.ts (ApiClient, imageUri, uploadImage), search.ts, links.ts (call/map/
                        homepage), push.ts + notifications.ts (push), feed.ts, useListings.ts, ...
    src/theme.ts        color tokens (navy, brand, accent, gray, border)
packages/
  shared/               types.ts, schemas.ts (zod), api-client.ts
.github/workflows/
  deploy.yml            push-to-main → SSH into the server → git pull, build, restart
```

## Icon system (do not hand-draw SVG icons)

All icons come from **`@expo/vector-icons`**, which already bundles every major icon family
(MaterialIcons — Google's Material Icons, MaterialCommunityIcons, FontAwesome/5/6, Ionicons,
Feather, AntDesign, Entypo, Octicons, ...). **Do not hand-code custom `react-native-svg` icon
paths** — earlier attempts at that looked amateurish and asymmetric; the user explicitly asked to
stop doing that. When a new icon is needed:

1. The user names a concept (e.g. "campaign", "business center", "diversity 1") or you pick a
   sensible icon name from a known family.
2. Import the family from `@expo/vector-icons` and use `<FamilyName name="icon-name" .../>`.
3. Icon name reference: https://icons.expo.fyi or https://pictogrammers.com/library/mdi/ (for
   MaterialCommunityIcons specifically).

Current mapping lives in `apps/mobile/src/components/HomeIcons.tsx` (used on the Home screen
cards) and `TabIcons.tsx` (bottom tab bar) — `FamilyIcon` (community) is intentionally shared
between the Home card and the Community tab icon so they match.

## Navigation structure

Root `Stack.Navigator` (`App.tsx`): `Splash → Main` (bottom tabs: Home / Services / Community /
MyPage). Everything else is pushed on top of `Main`:

- public lists + details: `JobWelfare`/`JobDetail`, `HealthMedical`/`HealthDetail`,
  `EducationCulture`/`EducationDetail`, `LifeConvenience`/`LifeConvenienceDetail`,
  `PartnerInfo`/`PartnerDetail`, `Notifications` (feed), `PostDetail`, `NewPost`
- account: `Login`, `Signup`, `MyActivity`, `InterestSettings`, `NotificationSettings`, `CustomerCenter`
- organization: `MyListings`/`ListingForm`, `MyAds`/`AdForm`/`AdDetail`
- admin (menu only visible to admins in MyPage): `AdminStats`, `AdminListings`, `AdminAds`,
  `AdminReports`, `AdminPosts`, `AdminUsers`

**Browse-first (Daangn-style):** the app always opens on Home and login is never forced. Guests can
read everything; only actions that need an account (like, comment, report, new post) send them to
`Login` at that moment. `Login` and `Signup` replace each other and, when done, go back to the screen
that opened them (`navigation.goBack()`), falling back to `Main` when the stack is empty.

## Known non-obvious decisions (read before "fixing" these)

- **The app opens on Home, never on Login/Signup.** Login is requested lazily (see "Browse-first"
  above) and guest-only prompts point to `Login`, not `Signup`. This replaced an earlier
  "Signup is the root screen" design - don't bring it back.
- **API responds only in Korean.** All `message` fields in error responses were once accidentally
  in Uzbek (a copy/paste mistake) and were all translated — keep any new error messages Korean.
- **Home screen has no scroll.** It's a fixed layout designed to fit one mobile viewport exactly
  (4 cards + notice bar + tab bar, no `ScrollView`). If you add content, keep this constraint or
  ask the user first.
- **Web `<TextInput>` needs `outlineStyle: "none"`** (see `IconInput.tsx`) — otherwise mobile
  Chrome shows a default black focus rectangle around inputs.
- **Bottom tab bar height/padding is intentionally generous** (`MainTabs.tsx`) because
  `useSafeAreaInsets()` returns `0` on web, and real mobile browsers still need enough padding for
  their own chrome, or labels/icons get clipped.
- **Expo Go (Android) cannot do remote push, and importing `expo-notifications` there crashes the
  whole app.** `src/lib/notifications.ts` therefore only `require`s the module outside Expo Go;
  everywhere else use that wrapper, never `import ... from "expo-notifications"` at runtime. Real
  push needs `eas init` + Firebase + a dev build (see `DEPLOYMENT.md`).
- **Uploaded images are stored as relative paths** (`/api/uploads/<file>`) so the host can differ per
  environment (emulator `10.0.2.2`, staging, production). Always render them through `imageUri()`.
- **Search and the region/category filters on service lists are client-side** (`matchesQuery`,
  `matchesRegionFilter`) over the already-fetched list (max 50 per type).
- **Listing types are `job | health | education | life`**; organization listings start as `pending`
  and only show publicly once an admin sets them `active`.
- **Push categories** (`notice, newPost, comment, like, event, partner`) are user-togglable;
  `system` pushes (e.g. ad review result) ignore the toggles. In-app `Notification` rows are
  written regardless of the push toggle. `newPost`/`event`/`partner` have settings but no trigger yet.
- Line endings: the repo uses `core.autocrlf=true` on Windows, so the index stores LF.

## Feature map (what lives where)

| Layer | Feature | Code |
|---|---|---|
| Information | job/health/education/life lists + details, search, region/category filters | `useListings`, `*Screen.tsx`, `routes/listings.ts` |
| Community | posts with up to 3 photos, comments, likes, reports | `routes/posts.ts`, `comments.ts`, `likes.ts`, `reports.ts`, `uploads.ts` |
| Partners | partner list/detail, call / map / homepage links | `routes/partners.ts`, `PartnerDetailScreen`, `lib/links.ts` |
| Admin & notifications | feed, in-app notifications, push, admin approvals, **통계** | `routes/feed.ts`, `notifications.ts`, `push.ts`, `routes/admin.ts`, `AdminStatsScreen` |
| Organizations | listing + banner-ad requests with admin review | `routes/listings.ts`, `ad-requests.ts`, `My*`/`Admin*` screens |
| External | `tel:`, Google Maps search by address, homepage in the browser | `lib/links.ts` |

