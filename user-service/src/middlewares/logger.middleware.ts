import { NextFunction, Request, Response } from 'express';

import { logInfo } from '@libs/logger/info.logger';

export function loggerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  logInfo(`REQUEST ${req.method} ${req.originalUrl}`, 'HTTP');

  next();
}
