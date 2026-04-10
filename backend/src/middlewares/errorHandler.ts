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
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Errores lanzados explícitamente con throw new Error()
  const statusCode = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Manejar errores específicos de Mongoose si es necesario
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID no válido' });
  }

  res.status(statusCode).json({ message });
};
