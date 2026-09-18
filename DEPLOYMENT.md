# Deployment

## Overview

```
git push origin main
      │
      ▼
GitHub Actions (.github/workflows/deploy.yml)
      │  SSH via appleboy/ssh-action, using repo secrets:
      │    DEPLOY_HOST = 49.247.205.179
      │    DEPLOY_USER = root
      │    DEPLOY_SSH_KEY = (private key; the matching public key is in
      │                      the server's ~/.ssh/authorized_keys)
      ▼
Server (49.247.205.179) — a shared VPS that also runs unrelated projects
  /opt/sinity                 ← `git reset --hard origin/main` happens here
    apps/api                  ← pnpm install, prisma generate, prisma migrate deploy,
                                 then `pm2 restart sinity-api`
                                 (runs `tsx src/server.ts` directly — no build step)
    apps/mobile                ← npm install, `expo export -p web` with
                                 EXPO_PUBLIC_API_URL baked in, output copied to:
  /var/www/sinity-web          ← served statically by nginx
  nginx site "sinity"          ← listens on :8090
                                   /       → static files in /var/www/sinity-web
                                   /api/*  → proxy_pass to 127.0.0.1:4000/api/
```

Live URL: **http://49.247.205.179:8090**

## Exact workflow file

See `.github/workflows/deploy.yml` — the remote script it runs is the single source of truth;
this doc explains the *why*, don't let it drift from the actual file.

## Server layout (facts, not guesses — verified by SSH)

- OS: Ubuntu, nginx 1.24.0, Node v22.23.1, `pnpm` and `pm2` installed globally, PostgreSQL running
  locally on the box (`127.0.0.1:5432`).
- Other projects already on this server (do not touch their nginx configs, PM2 processes, or
  ports): PM2 processes `ETcomp` and `et-company`; nginx sites `ETcomp` (port 80/443, domain
  `etcom.kr`), `HCRequest` (domain `etcom.app.re.kr`), `et-company-web` (port 8080). Sinity uses
  **port 8090** and PM2 process name **`sinity-api`** specifically to avoid collisions.
- `/opt/sinity` — a full `git clone` of this repo, kept in sync via `git reset --hard` on every
  deploy (so never leave uncommitted work you care about on the server — it gets discarded).
- `/opt/sinity/apps/api/.env` — **not** in git (gitignored). Contains
  `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PORT=4000`, `CORS_ORIGIN=*`. If you
  need to change these, edit that file directly on the server (or recreate it — see "Recreating
  server secrets" below); the deploy workflow never touches it.
- PostgreSQL: role `sinity`, database `sinity`, owner = role `sinity`. Local dev uses a
  *different* Postgres instance/credentials (your own machine) — they are not the same database.
- `/var/www/sinity-web` — fully replaced (`rm -rf` then copy) on every deploy. Never edit files
  here by hand; they will be wiped on the next push.
- nginx config: `/etc/nginx/sites-available/sinity` (symlinked into `sites-enabled`).
- Firewall: `ufw allow 8090/tcp` was run once already; port 8090 is open.

## Recreating server access (if the deploy key is ever lost/rotated)

The deploy key is **not** stored anywhere in this repo or on the local dev machine on purpose
(it's a GitHub Actions secret only). To rotate it or do a one-off manual task on the server:

1. Generate a fresh keypair locally: `ssh-keygen -t ed25519 -f ./tmpkey -N ""`.
2. Ask the human maintainer to run this **on their machine** (they have the server root
   password):
   ```bash
   ssh root@49.247.205.179 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '<paste tmpkey.pub content>' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo DONE"
   ```
3. Use `ssh -i ./tmpkey root@49.247.205.179 "..."` for whatever one-off task is needed.
4. **Clean up afterwards**: remove the line you added from the server's
   `~/.ssh/authorized_keys` (`grep -v '<your key comment>' ~/.ssh/authorized_keys > tmp && mv tmp
   ~/.ssh/authorized_keys`) and delete the local keypair. Do not leave extra keys authorized.
5. To update the *permanent* GitHub Actions key instead of a temporary one, use
   `gh secret set DEPLOY_SSH_KEY --repo UsmanSNT/sinitiy < path/to/private_key` (requires `gh auth
   status` to already be logged in as a user with repo admin rights).

## Manual redeploy / rollback

The workflow can be re-run for the current `main` without a new commit:

```bash
gh workflow run deploy.yml --repo UsmanSNT/sinitiy
# or re-run a specific past run:
gh run rerun <run-id> --repo UsmanSNT/sinitiy
```

To roll back to a previous commit, revert/reset locally and push — there is no separate rollback
mechanism; the server always mirrors whatever is on `main`.

## Database migrations

Prisma migrations are committed to git (`apps/api/prisma/migrations/`). The deploy workflow runs
`npx prisma migrate deploy` (not `migrate dev`) — it applies pending migrations without prompting
and never generates new migration files on the server. **Always create migrations locally**
(`npx prisma migrate dev --name <description>`) and commit the generated SQL before pushing.

## Environment variables baked into the web build

`EXPO_PUBLIC_API_URL` is set at build time (in the GitHub Actions script) to
`http://49.247.205.179:8090/api` — this gets compiled into the static JS bundle. If the server's
IP or port ever changes, update it in **both** `.github/workflows/deploy.yml` and re-deploy;
there is no runtime config for this on web builds. (Android/iOS native builds don't need this —
they use the platform-aware default in `apps/mobile/src/lib/api.ts`, or their own
`EXPO_PUBLIC_API_URL` at EAS Build time once that's set up.)
