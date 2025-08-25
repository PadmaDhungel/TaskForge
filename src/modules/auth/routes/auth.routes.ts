import { Router } from 'express';
import { getme, login, register } from '../controllers/auth.controller';
import { authMiddleware } from '../../../middlewares/authMiddlewares';

const router = Router();

router.post("/register", register);
router.post('/login', login);
router.get("/me", authMiddleware, getme);

export default router;