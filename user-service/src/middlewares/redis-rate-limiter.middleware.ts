import type { NextFunction, Request, Response } from 'express';
import { RateLimiterRes } from 'rate-limiter-flexible';

import { TooManyRequestsException } from '@common/exceptions/too-many-requests.exception';
import { getUserRateLimiter } from '@libs/limiter/user-rate.limiter';

export async function userRateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const limiter = getUserRateLimiter();

  try {
    const key = await limiter.consume(
      req.signedCookies['refreshToken'] ?? req.ip ?? 'anonymous',
    );

    res.set({
      'X-User-RateLimit-Policy': `q=${limiter.points};w=${limiter.duration}`,
      'X-User-RateLimit-Limit': limiter.points,
      'X-User-RateLimit-Remaining': key.remainingPoints,
      'X-User-RateLimit-Reset': Math.ceil(key.msBeforeNext / 1000),
    });

    next();
  } catch (error: unknown) {
    if (error instanceof RateLimiterRes) {
      res.set({
        'X-User-Retry-After': Math.ceil(error.msBeforeNext / 1000),
      });

      return next(
        new TooManyRequestsException(
          'Too many requests, please try again later',
        ),
      );
    }

    return next(error);
  }
}
