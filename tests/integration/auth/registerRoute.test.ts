import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/db';

beforeEach(async () => {
    await prisma.user.deleteMany(); // Clean DB before each test
});

describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                email: 'testuser@example.com',
                password: 'strong_Password123',
                name: 'Test User',
            })
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user')
        expect(res.body.user.email).toBe('testuser@example.com')
        expect(res.body).toHaveProperty("token")
    });
    it('rejects duplicate email', async () => {
        await prisma.user.create({
            data: {
                email: 'test@example.com',
                password: 'strong_Password123',
                name: 'Test User',
            },
        });

        const res = await request(app).post('/api/v1/auth/register').send({
            email: 'test@example.com',
            password: 'Abcd$123',
            name: 'Test User',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/already registered/i);
    });
    it('should return 400 if email is missing', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                password: 'strong_Password123',
                name: 'Test User',
            });
        expect(res.statusCode).toBe(400);
    });
    it('rejects invalid email format', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            email: 'not-an-email',
            password: 'Abcd$123',
            name: 'Test User',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/email/i);
    });
    it('rejects if password is missing', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            email: 'test@example.com',
            name: 'Test User',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/password/i);
    });
    it('rejects if name is missing', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            email: 'test@example.com',
            password: 'Abcd$123',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/name/i);
    });


    it('rejects empty request body', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/required/i);
    });

    it('rejects extra unexpected fields gracefully', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            email: 'test@example.com',
            password: 'Abcd$123',
            name: 'Test User',
            extraField: 'ignore me',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });


})