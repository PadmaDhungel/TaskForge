import prisma from '../../../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { RegisterInput, LoginInput } from '../validators/auth.schemas';
import { ConflictError, AuthError } from '../../../errors';

export const registerUser = async ({ email, password, name }: RegisterInput) => {

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new ConflictError('Email is already registered');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name }
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { user, token }
}
export const loginUser = async ({ email, password }: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new AuthError("Invalid credentials")
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new AuthError("Invalid credentials")
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { user, token }
}