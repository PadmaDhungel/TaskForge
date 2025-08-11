import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email({ message: 'Invalid Email Format' }),
    password: z.string()
        .nonempty({ message: 'Password is required' })  // <-- catch missing/empty password
        .min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string()
        .nonempty({ message: 'Name is required' }),
}).strict();
