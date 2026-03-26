import { Request, Response, NextFunction } from "express";
import config from "../config/config.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers["authorization"] || req.headers["x-api-key"];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const expectedToken = config.authToken;

  const providedToken = Array.isArray(token) ? token[0] : token;
  const actualToken = providedToken.startsWith("Bearer ")
    ? providedToken.split(" ")[1]
    : providedToken;

  if (actualToken !== expectedToken) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }

  next();
};
