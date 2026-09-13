import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const field = firstIssue?.path.join(".") || "field";
    return res.status(400).json({ error: `Invalid ${field}: ${firstIssue?.message}` });
  }

  console.error(err);
  return res.status(500).json({ error: "Something went wrong on our end" });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Route not found" });
}