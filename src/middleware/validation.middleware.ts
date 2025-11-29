import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: 'Validation failed', details: error.message });
      } else {
        res.status(400).json({ error: 'Validation failed' });
      }
    }
  };
};
