-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "clockBorder" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "noveltyCheck" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "error" TEXT NOT NULL DEFAULT '';
