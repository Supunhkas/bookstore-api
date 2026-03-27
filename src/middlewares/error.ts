import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import config from "../config/config.js";

export interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || undefined;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Consistent error response format
  const response = {
    success: false,
    status: "error",
    statusCode,
    message,
    ...(errors && { errors }),
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  };

  if (statusCode >= 500) {
    console.error(`[Error] ${statusCode} - ${err.message || message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(statusCode).json(response);
};
