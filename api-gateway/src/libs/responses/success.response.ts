import type { Response } from 'express';

import type { ResponseSuccessParams } from '@common/types/response.type';

export function responseSuccess<T>({
  res,
  statusCode,
  message,
  data = undefined,
}: ResponseSuccessParams<T>): Response {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
}
