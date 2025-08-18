// tests/helpers/dbCleanup.ts
import prisma from "../../src/db";

export async function cleanDatabase() {
    // Delete in the correct order to avoid FK constraint errors
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
}
