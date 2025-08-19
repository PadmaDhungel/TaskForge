-- DropForeignKey
ALTER TABLE "public"."BoardMember" DROP CONSTRAINT "BoardMember_boardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BoardMember" DROP CONSTRAINT "BoardMember_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."BoardMember" ADD CONSTRAINT "BoardMember_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardMember" ADD CONSTRAINT "BoardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
