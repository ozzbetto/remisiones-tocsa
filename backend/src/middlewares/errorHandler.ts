import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: err.issues.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID no válido' });
  }

  res.status(statusCode).json({ message });
};
