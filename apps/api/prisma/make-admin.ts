// Mavjud hisobni admin qiladi (ilovada admin bo'lib ro'yxatdan o'tish yo'q).
// Ishlatish: npx tsx prisma/make-admin.ts <email>
import { PrismaClient } from "@prisma/client";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npx tsx prisma/make-admin.ts <email>");
  process.exit(1);
}

const prisma = new PrismaClient();
prisma.user
  .update({ where: { email }, data: { userType: "admin" }, select: { email: true, userType: true } })
  .then((u) => console.log(`${u.email} -> ${u.userType}`))
  .catch((err) => {
    console.error(err.code === "P2025" ? `No user with email ${email}` : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
