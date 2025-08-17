-- AlterTable
ALTER TABLE "public"."BoardMember" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "updatedAt" DROP DEFAULT;
