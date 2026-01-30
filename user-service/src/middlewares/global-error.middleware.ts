import type { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { ClientException } from '../common/exceptions';
import { MongooseTypeError } from '../common/utils/mongo-error.util';
import { logError } from '../libs/logger';
import { responseFail } from '../libs/responses';

export function errorGlobalMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!err || res.headersSent) {
    return next();
  }

  if (err instanceof ZodError) {
    responseFail({
      res,
      statusCode: 400,
      message: 'Validation failed',
      errors: err.issues,
    });

    return;
  }

  if (err instanceof ClientException) {
    responseFail({
      res,
      statusCode: err.statusCode,
      message: err.message,
    });

    return;
  }

  if (MongooseTypeError.isValidationError(err)) {
    responseFail<typeof err.errors>({
      res,
      statusCode: 400,
      message: 'Validation failed',
      errors: err.errors,
    });

    return;
  }

  if (MongooseTypeError.isCastError(err)) {
    responseFail({
      res,
      statusCode: 400,
      message: err.message,
    });

    return;
  }

  if (MongooseTypeError.isDuplicateError(err)) {
    const errKeys = Object.keys(err['keyValue']);

    responseFail({
      res,
      statusCode: 409,
      message: `Duplicate value of ${errKeys.join(', ')}`,
    });

    return;
  }

  if (MongooseTypeError.isError(err) || MongooseTypeError.isServerError(err)) {
    responseFail({
      res,
      statusCode: 500,
      message: 'INTERNAL SERVER ERROR',
    });

    logError('Global Error Middleware', err, 'MIDDLEWARE-MONGO');

    return;
  }

  if (err instanceof JsonWebTokenError) {
    responseFail({
      res,
      statusCode: 401,
      message: err.message,
    });

    logError('Global Error Middleware', err, 'MIDDLEWARE-JWT_ERROR');

    return;
  }

  responseFail({
    res,
    statusCode: 500,
    message: 'INTERNAL SERVER ERROR',
  });

  logError('Global Error Middleware', err, 'MIDDLEWARE');
}
