import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});


export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  businessName: z.string().min(1, { message: 'Business name is required' }).optional(),
  businessAddress: z.string().min(1, { message: 'Business address is required' }).optional(),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }).optional(),
    role: z.enum(['vendor', 'customer', 'admin']).default('vendor'),
});


export const createVendorSchema = z.object({
  businessName: z.string().min(1, { message: 'Business name is required' }),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const updateVendorSchema = z.object({
  businessName: z.string().min(1, { message: 'Business name is required' }).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const createOrderSchema = z.object({
  amount: z.number().positive({ message: 'Amount must be a positive number' }),
  item: z.string().min(1, { message: 'Item description is required' }),
});

export const updateOrderSchema = z.object({
  amount: z.number().positive({ message: 'Amount must be a positive number' }).optional(),
  currency: z.string().min(3, { message: 'Currency must be at least 3 characters' }).max(3, { message: 'Currency must be 3 characters' }).optional(),
  item: z.string().min(1, { message: 'Item description is required' }).optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
});