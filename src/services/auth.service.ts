import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput } from '../validators/auth.schemas';

export const registerUser = async ({ email, password, name }: RegisterInput) => {
    if (!email || !password || !name) {
        throw { statusCode: 400, message: 'Email, Password and name are required' };
    };
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw { statusCode: 400, message: "User already registered" }
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name }
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { user, token }
}