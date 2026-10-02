# Agent notes

Read in this order before touching anything:

1. [`README.md`](./README.md) — what this is, tech stack, local dev setup, project structure.
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — *why* it's built this way (one Expo codebase for
   web+mobile, single Node/Express/Prisma/Postgres backend, icon system rules).
3. [`DEPLOYMENT.md`](./DEPLOYMENT.md) — exact git → GitHub Actions → server pipeline, server
   file layout, how to get temporary SSH access if you ever need to run something on the server
   directly.

The human maintainer communicates in **Uzbek**; the product's UI language is **Korean**. Code
comments are a mix of Uzbek (for non-obvious *why*) and none (self-explanatory code). Match
whichever is already used in a file you're editing.

`apps/mobile/AGENTS.md` has an additional Expo-version-specific note — read it too if you're
working inside `apps/mobile`.

## Fast facts an agent tends to get wrong on first guess

- There is **one frontend** (`apps/mobile`, Expo + react-native-web), not a separate web app.
  Don't recreate a Next.js/Vite web project — extend the Expo app instead.
- `apps/mobile` is **not** part of the pnpm workspace; it uses plain `npm`. Don't add it to
  `pnpm-workspace.yaml`.
- Icons: use `@expo/vector-icons` (MaterialIcons/MaterialCommunityIcons/FontAwesome5/...) by
  name. Never hand-write `react-native-svg` icon paths.
- API error messages must be in **Korean**.
- The app **opens on Home** and never forces login. Guest actions send users to `Login` at that
  moment (it returns to the opener). Don't make Signup/Login the root screen again.
- Import `expo-notifications` only via `src/lib/notifications.ts` — importing it directly crashes
  Expo Go on Android, which is the usual dev/test target.
- Uploaded images are stored as **relative** paths (`/api/uploads/...`); render with `imageUri()`.
  Listing and ad forms have no image field yet (their API schemas still accept only full URLs).
- The Home screen must fit one mobile viewport with no scrolling.
- Every push to `main` **auto-deploys to a live shared demo server** — commit only
  working, type-checked changes (`npx tsc --noEmit` in `apps/api` and `apps/mobile`).
  Photo uploads need nginx `client_max_body_size 10m` on the server (see `DEPLOYMENT.md`).
