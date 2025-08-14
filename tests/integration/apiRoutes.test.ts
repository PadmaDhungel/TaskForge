import request from 'supertest';
import app from '../../src/app';

describe('API Routing & Health', () => {
    it('should return 200 for /health', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'OK' });
    });

    it('should return 200 for /api/v1/health', async () => {
        const res = await request(app).get('/api/v1/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'OK' });
    });

    it('should return 404 for unknown endpoint', async () => {
        const res = await request(app).get('/api/v1/does-not-exist');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'NotFound Error');
    });
});
