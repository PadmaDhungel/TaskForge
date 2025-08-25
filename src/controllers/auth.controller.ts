import { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { loginSchema, registerSchema } from '../validators/auth.schemas';
import { ZodError } from 'zod';
import { nextTick } from 'process';

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
