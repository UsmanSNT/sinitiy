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
npx tsx prisma/seed.ts  # seeds community categories
npx tsx watch src/server.ts   # http://localhost:4000

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
    src/routes/         one file per resource (auth, posts, comments, listings, admin, ...)
    prisma/schema.prisma
  mobile/               Expo app — THE frontend (web + Android + iOS from one codebase)
    App.tsx             React Navigation root (Stack: Splash/Login/Signup/Main/PostDetail/NewPost)
    src/navigation/     Stack + bottom tab param types and the MainTabs component
    src/screens/        one screen per route
    src/components/     shared UI (IconInput, SocialButton, HomeIcons, TabIcons, BackButton)
    src/context/        AuthContext (token in AsyncStorage, current user)
    src/lib/api.ts      ApiClient instance + platform-aware base URL
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

Root `Stack.Navigator` (`App.tsx`): `Splash → Signup` (default entry point for logged-out users —
**not** Login; Login is reached only via a link from Signup, matching the design the user
approved) `→ Main` (bottom tabs: Home / Services / Community / MyPage) with `PostDetail` and
`NewPost` pushed on top of `Main` for the community flow.

## Known non-obvious decisions (read before "fixing" these)

- **Signup, not Login, is the app's root/default screen.** Login only shows a back button when
  reached from Signup (`navigation.canGoBack()`); as a root screen after logout it has none. This
  was an explicit design choice, not a bug.
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
