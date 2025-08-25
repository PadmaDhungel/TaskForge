import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string({ error: 'Email is required' }).email({ message: 'Invalid Email Format' }),
    password: z.string({ error: 'password is required' })
        .nonempty({ message: 'Password is required' })  // <-- catch missing/empty password
        .min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string({ error: 'name is required' })
        .nonempty({ message: 'Name is required' }),
}).strip();//.strict works except for that it fails the extra field, os .strip is favoured

export type RegisterInput = z.infer<typeof registerSchema>;