import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  phone: z.string().max(20).optional().nullable(),
  department: z
    .string({ required_error: 'Department is required' })
    .min(1, 'Department is required'),
  position: z
    .string({ required_error: 'Position is required' })
    .min(1, 'Position is required'),
  salary: z
    .number({ required_error: 'Salary is required' })
    .positive('Salary must be a positive number'),
  joiningDate: z
    .string({ required_error: 'Joining date is required' })
    .or(z.date()),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),
  attendanceRate: z.number().min(0).max(100).optional().nullable(),
  leaves: z.number().int().min(0).optional(),
  performanceRate: z.number().min(0).max(5).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
