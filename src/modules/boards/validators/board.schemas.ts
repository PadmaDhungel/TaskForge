import { z } from 'zod';

export const createBoardSchema = z.object({
    name: z.string({ error: 'Board name is required' }).min(1, { message: 'Board name can not be empty' }).max(70, { message: 'Board name must be less than 70 characters' }),
    description: z.string().max(500, { message: "Description too long" }).optional()

}).strict()
export const updateBoardSchema = z.object({
    name: z.string().min(1, { message: "name can not be empty" }).max(70).optional(),
    description: z.string().max(500).optional()
}).strict()

// Infer TypeScript types from schemas
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;