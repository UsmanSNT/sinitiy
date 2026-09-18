# 시니티 (Sinity) - Senior Integrated Info Platform

Monorepo fundament: `apps/api` (Node.js/Express + Prisma/PostgreSQL), `apps/web` (Next.js - user + `/admin`), `packages/shared` (umumiy tiplar/validatsiya/API client - keyinchalik React Native mobil ilovada ham ishlatiladi).

## Ishga tushirish

1. PostgreSQL o'rnating (yoki Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`)
2. `apps/api/.env` faylini to'ldiring (`.env.example` asosida)
3. Root papkada:

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

- Web: http://localhost:3000
- Admin: http://localhost:3000/admin (admin roli kerak - hozircha DB'da qo'lda `userType: admin` qilib qo'yish kerak)
- API: http://localhost:4000

## Tuzilish

- `apps/api` - Express REST API, JWT auth, Prisma ORM
- `apps/web` - Next.js: `(user)` route group - foydalanuvchi UI (mobil-first, bottom nav), `admin` - boshqaruv paneli
- `packages/shared` - TypeScript tiplar, zod sxemalar, platformadan mustaqil `ApiClient` (React Native'da qayta ishlatiladi)

## Hozirgi holat (fundament)

- Auth: individual/organization ro'yxatdan o'tish (biznes raqami bilan), login, JWT
- Community: post CRUD, comment, like, report, admin moderatsiya
- Listings: job/health/education CRUD (org/admin), lokatsiya maydonlari (xarita integratsiyasi keyingi bosqichda)
- Ad requests: org so'rov yuboradi → admin tasdiqlaydi/rad etadi → notification yaratiladi
- Admin: users, posts, listings, partners, settings, ad-requests sahifalari

## Keyingi bosqichlar

- Xarita komponenti (Kakao/Naver Map + Google Maps) health/education sahifalarida
- Rasm yuklash (S3-compatible storage)
- Firebase Cloud Messaging orqali haqiqiy push notification
- Admin dashboard statistikasi
- React Native mobil ilova (`packages/shared`dan foydalanadi)
