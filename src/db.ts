import { PrismaClient, BoardRole } from '@prisma/client';
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}
const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
});
export default prisma
export { BoardRole };
