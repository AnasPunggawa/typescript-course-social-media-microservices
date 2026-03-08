import { logInfo } from '@libs/logger/info.logger';
import type { NextFunction, Request, Response } from 'express';

export function logMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  logInfo(`REQUEST ${req.method} ${req.originalUrl}`, 'HTTP');

  next();
}
