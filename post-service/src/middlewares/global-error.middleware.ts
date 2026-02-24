import type { NextFunction, Request, Response } from 'express';

import { ClientException } from '@common/exceptions/client.exception';
import { logError } from '@libs/logger/error.log';
import { responseFail } from '@libs/responses/fail.response';

export function globalErrorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!error || res.headersSent) {
    return next();
  }

  logError(`Global Error Middleware`, error, 'MIDDLEWARE');

  if (error instanceof ClientException) {
    responseFail({ res, statusCode: error.statusCode, message: error.message });

    return;
  }

  responseFail({ res, statusCode: 500, message: 'INTERNAL SERVER ERROR' });
}
