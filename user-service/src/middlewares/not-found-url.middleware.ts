import { NextFunction, Request, Response } from 'express';
import { NotFoundException } from '../common/exceptions';

export function notFoundURLMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    return next();
  }

  return next(new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`));
}
