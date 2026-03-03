import type { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';

import { ClientException } from '@common/exceptions/client.exception';
import { MongooseTypeError } from '@common/utils/mongo-error.util';
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

  logError(`Global Error Middleware`, error, 'MIDDLEWARE');

  if (error instanceof ZodError) {
    responseFail({
      res,
      statusCode: 400,
      message: 'Validation failed',
      errors: error.issues,
    });

    return;
  }

  if (error instanceof ClientException) {
    responseFail({
      res,
      statusCode: error.statusCode,
      message: error.message,
    });

    return;
  }

  if (MongooseTypeError.isValidationError(error)) {
    responseFail<typeof error.errors>({
      res,
      statusCode: 400,
      message: 'Validation failed',
      errors: error.errors,
    });

    return;
  }

  if (MongooseTypeError.isCastError(error)) {
    responseFail({
      res,
      statusCode: 400,
      message: error.message,
    });

    return;
  }

  if (MongooseTypeError.isDuplicateError(error)) {
    const errKeys = Object.keys(error['keyValue']);

    responseFail({
      res,
      statusCode: 409,
      message: `Duplicate value of ${errKeys.join(', ')}`,
    });

    return;
  }

  if (
    MongooseTypeError.isError(error) ||
    MongooseTypeError.isServerError(error)
  ) {
    responseFail({
      res,
      statusCode: 500,
      message: 'INTERNAL SERVER ERROR',
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

  responseFail({
    res,
    statusCode: 500,
    message: 'INTERNAL SERVER ERROR',
  });
}
