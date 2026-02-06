import { TooManyRequestsException } from '@common/exceptions/too-many-requests.exception';
import rateLimit from 'express-rate-limit';

export function apiRateLimit(
  limitRequests: number = 50, // number of limit requests based on timeMs
  timeMs: number = 1000 * 60 * 15, // 15 minutes
) {
  return rateLimit({
    windowMs: timeMs,
    limit: limitRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, _res, next, option) {
      return next(new TooManyRequestsException(option.message));
    },
  });
}
