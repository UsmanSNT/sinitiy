import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const names = ["자유게시판", "동네소식", "취미생활"];
  for (const name of names) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log("Seed done:", names.join(", "));
}

main().finally(() => prisma.$disconnect());
