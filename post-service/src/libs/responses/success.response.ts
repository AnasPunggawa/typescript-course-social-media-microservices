import type {
  ResponseSuccess,
  ResponseSuccessParams,
} from '@common/types/response.type';

export function responseSuccess<T>({
  res,
  statusCode,
  message,
  data = undefined,
}: ResponseSuccessParams<T>): ResponseSuccess<T> {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
}
