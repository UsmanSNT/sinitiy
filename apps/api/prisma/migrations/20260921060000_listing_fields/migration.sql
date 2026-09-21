-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ListingStatus" ADD VALUE 'pending';
ALTER TYPE "ListingStatus" ADD VALUE 'rejected';

-- AlterEnum
ALTER TYPE "ListingType" ADD VALUE 'life';

-- DropIndex
DROP INDEX "listings_listingType_idx";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "category" TEXT,
ADD COLUMN     "period" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "summary" TEXT;

-- CreateIndex
CREATE INDEX "listings_listingType_status_idx" ON "listings"("listingType", "status");

