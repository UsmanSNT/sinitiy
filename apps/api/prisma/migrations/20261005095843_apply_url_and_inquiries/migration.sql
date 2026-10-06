-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'inquiry_answered';

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "applyUrl" TEXT;

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inquiries_userId_idx" ON "inquiries"("userId");

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
