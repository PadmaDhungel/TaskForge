import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema } from '../validators/auth.schemas';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.parse(req.body);
        const { user, token } = await authService.registerUser(
            parsed.email,
            parsed.password,
            parsed.name
        );
        return res.status(201).json({ user, token });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues
                .map(issue => `${issue.path.join('.')}: ${issue.message}`)
                .join(', ');

            return res.status(400).json({ error: errorMessages });
        }

        const message =
            typeof error === 'object' && error !== null && 'message' in error
                ? (error as any).message
                : 'Unknown error';

        const statusCode =
            typeof (error as any)?.statusCode === 'number'
                ? (error as any).statusCode
                : 500;

        return res.status(statusCode).json({ error: message });
    }
};
