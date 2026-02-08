import type { Response } from 'express';

import { ResponseFailParams } from '@common/types/response.type';

export function responseFail<T>({
  res,
  statusCode,
  message,
  errors = undefined,
}: ResponseFailParams<T>): Response {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
}
