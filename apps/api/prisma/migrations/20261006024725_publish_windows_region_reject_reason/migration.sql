-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'listing_approved';
ALTER TYPE "NotificationType" ADD VALUE 'listing_rejected';

-- AlterTable
ALTER TABLE "ad_requests" ADD COLUMN     "displayEnd" TIMESTAMP(3),
ADD COLUMN     "displayStart" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "publishEnd" TIMESTAMP(3),
ADD COLUMN     "publishStart" TIMESTAMP(3),
ADD COLUMN     "rejectReason" TEXT;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "region" TEXT;
