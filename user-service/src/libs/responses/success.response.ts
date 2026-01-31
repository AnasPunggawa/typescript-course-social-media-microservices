import type { Response } from 'express';

import { ResponseSuccessParams } from '@common/types/response.type';

export function responseSuccess<T>({
  res,
  message,
  statusCode,
  data = undefined,
}: ResponseSuccessParams<T>): Response {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
}
