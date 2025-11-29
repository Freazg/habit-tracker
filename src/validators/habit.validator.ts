import { z } from 'zod';

export const createHabitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  frequency: z.enum(['daily', 'weekly']),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  targetDays: z
    .array(z.number().min(0).max(6))
    .optional()
    .refine((days) => !days || days.length > 0, {
      message: 'Target days cannot be empty for weekly habits',
    }),
});

export const updateHabitSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
  categoryId: z.string().uuid().optional(),
  targetDays: z.array(z.number().min(0).max(6)).optional(),
  isActive: z.boolean().optional(),
});
