import { RequestHandler } from 'express';
import { z, ZodError } from 'zod';

export const validate = <T extends z.ZodRawShape>(schema: z.ZodObject<T>): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        errors: { form: 'Request body is missing or empty' },
      });
      return;
    }

    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.flatten().fieldErrors;
        res.status(400).json({
          errors: Object.keys(formattedErrors).reduce(
            (acc, key) => ({
              ...acc,
              [key]: formattedErrors[key]?.[0] || 'Invalid value',
            }),
            {},
          ),
        });
        return;
      }
      res.status(500).json({ errors: { server: 'Internal server error' } });
    }
  };
};