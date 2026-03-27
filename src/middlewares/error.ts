import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import config from '../config/config.js';

export interface AppError extends Error {
  statusCode?: number;
  errors?: unknown[];
}

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isObject = typeof err === 'object' && err !== null;
  const error = err as AppError;

  let statusCode = (isObject && error.statusCode) || 500;
  let message = (isObject && error.message) || 'Something went wrong';
  let errors = (isObject && error.errors) || undefined;

  // zod erros
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  const response = {
    success: false,
    status: 'error',
    statusCode,
    message,
    ...(errors && { errors }),
    ...(config.nodeEnv === 'development' && isObject && error.stack && { stack: error.stack }),
  };

  if (statusCode >= 500) {
    console.error(`[Error] ${statusCode} - ${message}`);
    if (isObject && error.stack) console.error(error.stack);
  }

  res.status(statusCode).json(response);
};
