-- AlterTable
ALTER TABLE "partner_companies" ADD COLUMN     "displayEnd" TIMESTAMP(3),
ADD COLUMN     "displayStart" TIMESTAMP(3),
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
