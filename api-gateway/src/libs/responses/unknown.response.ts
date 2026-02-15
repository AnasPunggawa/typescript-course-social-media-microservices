import type { Response } from 'express';

import type { UnknownResponse } from '@common/types/response.type';

export function unknownResponse<TData, TErrors>(
  res: Response,
  resBody: UnknownResponse<TData, TErrors>,
): Response {
  if (resBody.success === false) {
    return res.status(resBody.statusCode).json(resBody);
  } else {
    if (
      resBody.data &&
      typeof resBody.data === 'object' &&
      resBody.data !== null &&
      'tokens' in resBody.data &&
      typeof resBody.data.tokens === 'object' &&
      resBody.data.tokens !== null &&
      'refreshToken'
    ) {
    }

    return res.status(resBody.statusCode).json(resBody);
  }
}
