import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('GET /api/v1/auth/me ', () => {
    const testUser = {
        email: 'meuser@example.com',
        password: 'StrongPass123!',
        name: 'Profile Test',
    };

    let token: string;

    beforeAll(async () => {
        await prisma.user.deleteMany();
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        const user = await prisma.user.create({
            data: { email: testUser.email, password: hashedPassword, name: testUser.name },
        });

        token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'verysecret', {
            expiresIn: '1h',
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return user profile with valid token', async () => {
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(testUser.email);
        expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject request with missing token', async () => {
        const res = await request(app).get('/api/v1/auth/me');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/authorization/i);
    });

    it('should reject request with malformed Authorization header', async () => {
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Token ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/authorization/i);
    });

    it('should return 404 if user ID in token does not exist', async () => {
        const fakeIdToken = jwt.sign({ userId: 'non-existent-id' }, process.env.JWT_SECRET || 'verysecret');
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${fakeIdToken}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toMatch(/not found/i);
    });
});