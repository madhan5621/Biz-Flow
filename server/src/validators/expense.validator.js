import { z } from 'zod';

export const createExpenseSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  amount: z
    .number({ required_error: 'Amount is required' })
    .min(0, 'Amount must be positive'),
  category: z
    .string({ required_error: 'Category is required' })
    .min(1, 'Category is required')
    .max(100),
  description: z.string().max(1000).optional().nullable(),
  date: z.string().optional(),
  receipt: z.string().max(500).optional().nullable(),
});

export const updateExpenseSchema = createExpenseSchema.partial();
