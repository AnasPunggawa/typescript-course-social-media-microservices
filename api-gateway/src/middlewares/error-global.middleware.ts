import type { NextFunction, Request, Response } from 'express';

import { ClientException } from '@common/exceptions/client.exception';
import { logError } from '@libs/logger/error.logger';
import { responseFail } from '@libs/responses/fail.response';
import { responseSuccess } from '@libs/responses/success.response';
import { JsonWebTokenError } from 'jsonwebtoken';

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

  if (error instanceof ClientException) {
    responseSuccess({
      res,
      statusCode: error.statusCode,
      message: error.message,
    });

    return;
  }

  if (error instanceof JsonWebTokenError) {
    responseFail({
      res,
      statusCode: 401,
      message: error.message,
    });

    return;
  }

  responseFail({ res, statusCode: 500, message: 'INTERNAL SERVER ERROR' });
}
