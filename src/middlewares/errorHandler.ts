import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Zod validation error → wrap in ValidationError
    if (err instanceof ZodError) {
        const message = err.issues
            .map(i => `${i.path.join('.')}: ${i.message}`)
            .join(', ');
        return res.status(400).json({ error: message });
    }

    // 2. Custom AppError & subclasses
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // 3. Fallback → generic server error
    // console.error('Unhandled error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
};
