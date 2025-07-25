import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['admin', 'user', 'barber']),
});

export const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  duration: z.number().positive(),
  categoryId: z.string().optional(),
});

export const appointmentSchema = z.object({
  clientId: z.string(),
  barberId: z.string(),
  serviceId: z.string(),
  date: z.string().datetime(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'canceled', 'no-show']),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().min(0),
  categoryId: z.string().optional(),
});

export const orderSchema = z.object({
  clientId: z.string(),
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
  })),
  status: z.enum(['pending', 'paid', 'cancelled']),
  total: z.number().positive(),
});

export type RegisterData = z.infer<typeof userSchema>;
export type ServiceData = z.infer<typeof serviceSchema>;
export type AppointmentData = z.infer<typeof appointmentSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type OrderData = z.infer<typeof orderSchema>;
