import { z } from 'zod';

const invoiceItemSchema = z.object({
  productId: z.string().uuid('Invalid product'),
  quantity: z.number({ required_error: 'Quantity is required' }).int().min(1, 'Quantity must be at least 1'),
  price: z.number({ required_error: 'Price is required' }).min(0),
  discount: z.number().min(0).optional().default(0),
});

export const createInvoiceSchema = z.object({
  customerId: z.string({ required_error: 'Customer is required' }).uuid('Invalid customer'),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  taxRate: z.number().min(0).max(100).optional().default(0),
  discount: z.number().min(0).optional().default(0),
  status: z.enum(['PAID', 'PENDING', 'CANCELLED']).optional().default('PENDING'),
  notes: z.string().max(1000).optional().nullable(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

export const updateInvoiceSchema = z.object({
  customerId: z.string().uuid('Invalid customer').optional(),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  taxRate: z.number().min(0).max(100).optional(),
  discount: z.number().min(0).optional(),
  status: z.enum(['PAID', 'PENDING', 'CANCELLED']).optional(),
  notes: z.string().max(1000).optional().nullable(),
  items: z.array(invoiceItemSchema).min(1).optional(),
});
