import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be at most 200 characters')
    .trim(),
  sku: z
    .string({ required_error: 'SKU is required' })
    .min(1, 'SKU is required')
    .max(50, 'SKU must be at most 50 characters')
    .trim(),
  barcode: z.string().max(50).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  buyingPrice: z
    .number({ required_error: 'Buying price is required' })
    .min(0, 'Buying price must be positive'),
  sellingPrice: z
    .number({ required_error: 'Selling price is required' })
    .min(0, 'Selling price must be positive'),
  stock: z.number().int().min(0).optional().default(0),
  minStock: z.number().int().min(0).optional().default(5),
  isActive: z.boolean().optional().default(true),
  categoryId: z.string({ required_error: 'Category is required' }).uuid('Invalid category'),
  supplierId: z.string().uuid('Invalid supplier').optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();
