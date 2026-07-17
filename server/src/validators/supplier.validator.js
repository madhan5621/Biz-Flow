import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim()
    .optional()
    .nullable()
    .or(z.literal('')),
  phone: z.string().max(20).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  gstNumber: z
    .string()
    .max(20, 'GST number must be at most 20 characters')
    .optional()
    .nullable(),
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  zipCode: z.string().max(10).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateSupplierSchema = createSupplierSchema.partial();
