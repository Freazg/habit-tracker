import { z } from 'zod';

export const createLogSchema = z.object({
  habitId: z.string().uuid('Invalid habit ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  completed: z.boolean(),
  note: z.string().max(500, 'Note is too long').optional(),
});

export const updateLogSchema = z.object({
  completed: z.boolean().optional(),
  note: z.string().max(500).optional(),
});
