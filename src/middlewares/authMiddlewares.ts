import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthError } from '../errors/index';



export interface AuthRequest extends Request {
    user?: { userId: string };
}
export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthError('Missing or invalid Authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const jwtSecret = process.env.JWT_SECRET || 'verysecret'
        const decoded = jwt.verify(token, jwtSecret);
        if (
            typeof decoded === 'object' &&
            decoded !== null &&
            'userId' in decoded
        ) {
            req.user = { userId: (decoded as JwtPayload).userId as string };
            return next();
        }

        return next(new AuthError('Invalid token payload'));
    }
    catch (err) {
        return next(new AuthError('Invalid or expired token'));
    }
}