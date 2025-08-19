// tests/helpers/dbCleanup.ts
import prisma from "../../src/db";

export async function cleanDatabase() {
    // Delete in the correct order to avoid FK constraint errors
    await prisma.$transaction([
        prisma.boardMember.deleteMany(),
        prisma.board.deleteMany(),
        prisma.user.deleteMany(),
    ]);
}
