import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

export class MongooseTypeError {
  public static isValidationError(
    error: unknown,
  ): error is MongooseError.ValidationError {
    return error instanceof MongooseError.ValidationError;
  }

  public static isCastError(error: unknown): error is MongooseError.CastError {
    return error instanceof MongooseError.CastError;
  }

  public static isError(error: unknown): error is MongooseError {
    return error instanceof MongooseError;
  }

  public static isDuplicateError(error: unknown): error is MongoServerError {
    return error instanceof MongoServerError && error.code === 11000;
  }

  public static isServerError(error: unknown): error is MongoServerError {
    return error instanceof MongoServerError;
  }
}
