import type {
  ResponseFail,
  ResponseFailParams,
} from '@common/types/response.type';

export function responseFail<T>({
  res,
  statusCode,
  message,
  errors = undefined,
}: ResponseFailParams<T>): ResponseFail<T> {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
}
