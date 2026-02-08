import type { NextFunction, Request, Response } from 'express';

import { logError } from '@libs/logger/error.logger';
import { responseFail } from '@libs/responses/fail.response';

export function errorGlobalMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!error || res.headersSent) {
    return next();
  }

  logError('Error Global Middleware', error, 'MIDDLEWARE');

  responseFail({ res, statusCode: 500, message: 'INTERNAL SERVER ERROR' });
}
