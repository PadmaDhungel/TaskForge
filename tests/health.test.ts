import request from 'supertest';
import app from '../src/app';

describe('GET /health', () => {
    it('should return 200 OK and status OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'OK' });
    });
});
