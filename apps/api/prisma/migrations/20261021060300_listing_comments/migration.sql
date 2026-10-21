-- AlterEnum
ALTER TYPE "ReportTargetType" ADD VALUE 'listing_comment';

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "listingCommentId" TEXT;

-- CreateTable
CREATE TABLE "listing_comments" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "listing_comments_listingId_idx" ON "listing_comments"("listingId");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_listingCommentId_fkey" FOREIGN KEY ("listingCommentId") REFERENCES "listing_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_comments" ADD CONSTRAINT "listing_comments_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_comments" ADD CONSTRAINT "listing_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
