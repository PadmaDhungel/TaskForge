import { PrismaClient } from '@prisma/client';

const DATABASE_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
});

export default prisma;
