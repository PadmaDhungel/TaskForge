import { Router } from 'express';
import authRoutes from './auth.routes'

const router = Router();

// Health check (works for /health and /api/v1/health)
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
});
router.use('/auth', authRoutes)
export default router