import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  description: z.string().max(500).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();
