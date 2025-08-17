import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('GET /api/v1/auth/me ', () => {
    const testUser = {
        email: 'secureme@example.com',
        password: 'SecurePass123!',
        name: 'Security Test',
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

    it('should reject token signed with wrong secret', async () => {
        const wrongSecretToken = jwt.sign({ userId: 'someid' }, 'wrongsecret');
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${wrongSecretToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid/i);
    });

    it('should reject tampered token', async () => {
        const parts = token.split('.');
        const tampered = `${parts[0]}.${Buffer.from(JSON.stringify({ userId: 'hacked' })).toString('base64')}.${parts[2]}`;
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${tampered}`);
        expect(res.statusCode).toBe(401);
    });

    it('should reject expired token', async () => {
        const expiredToken = jwt.sign({ userId: 'someid' }, process.env.JWT_SECRET || 'verysecret', {
            expiresIn: '-1h',
        });
        const res = await request(app)
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/expired/i);
    });
});
