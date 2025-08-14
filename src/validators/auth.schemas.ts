import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string({ error: 'Email is required' }).email({ message: 'Invalid Email Format' }),
    password: z.string({ error: 'password is required' })
        .nonempty({ message: 'Password is required' })  // catch missing/empty password
        .min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string({ error: 'name is required' })
        .nonempty({ message: 'Name is required' }),
}).strict();

export const loginSchema = z.object({
    email: z.string({ error: 'Email is required' })
        .email({ message: 'Invalid Email Format' }),
    password: z.string({ error: 'Password is required' })
        .nonempty({ message: 'Password is required' }),
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
