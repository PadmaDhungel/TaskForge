import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('POST /api/v1/auth/login', () => {
    const testUser = {
        email: 'loginuser@example.com',
        password: 'StrongPass123!',
        name: 'Login Test',
    };

    beforeEach(async () => {
        await prisma.user.deleteMany();
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await prisma.user.create({
            data: {
                email: testUser.email,
                password: hashedPassword,
                name: testUser.name,
            },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should log in successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(testUser.email);
        expect(res.body).toHaveProperty('token');

        const decoded = jwt.decode(res.body.token);
        expect(decoded).toHaveProperty('userId');
    });

    it('should reject login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: 'WrongPass!@#',
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('should reject login for non-existent user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'nouser@example.com',
                password: 'SomePass123!',
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('should reject if email is missing', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                password: testUser.password,
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });

    it('should reject if password is missing', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/password/i);
    });

    it('should reject invalid email format', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'not-an-email',
                password: testUser.password,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });

    it('should reject empty request body', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/required/i);
    });
    it('should ignore unexpected fields in the request', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
                somethingExtra: 'malicious',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/unrecognized key/i);
    });
});
