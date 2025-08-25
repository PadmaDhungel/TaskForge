import { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { loginSchema, registerSchema } from '../validators/auth.schemas';
import { AuthRequest } from '../../../middlewares/authMiddlewares';
import { AuthError, NotFoundError } from '../../../errors';
import prisma from '../../../db';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.parse(req.body);
        const { user, token } = await registerUser(parsed);
        return res.status(201).json({ user, token });
    } catch (error) {
        return next(error)
    }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const { user, token } = await loginUser(parsed)
        return res.status(200).json({ user, token })
    }
    catch (error) {
        return next(error)
    }
}
export const getme = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.userId) {
            return next(new AuthError('Not authenticated'))
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        })
        if (!user) {
            return next(new NotFoundError("User not found"));
        }
        return res.status(200).json({ user })
    }
    catch (err) {
        next(err)
    }
}