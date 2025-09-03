/*
  Warnings:

  - The `role` column on the `BoardMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."BoardRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER', 'MEMBER');

-- AlterTable
ALTER TABLE "public"."BoardMember" DROP COLUMN "role",
ADD COLUMN     "role" "public"."BoardRole" NOT NULL DEFAULT 'MEMBER';
