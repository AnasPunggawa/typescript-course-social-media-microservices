import type { Response } from 'express';

import type { ResponseFailParams } from '@common/types/response.type';

export function responseFail<T>({
  res,
  message,
  statusCode,
  errors = undefined,
}: ResponseFailParams<T>): Response {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
}
