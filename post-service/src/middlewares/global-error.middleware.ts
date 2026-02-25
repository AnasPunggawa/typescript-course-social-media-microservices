import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ClientException } from '@common/exceptions/client.exception';
import { MongooseTypeError } from '@common/utils/mongoose-type-error.util';
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
    responseFail({ res, statusCode: error.statusCode, message: error.message });

    return;
  }

  if (MongooseTypeError.isValidationError(error)) {
    responseFail({
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

  responseFail({ res, statusCode: 500, message: 'INTERNAL SERVER ERROR' });
}
