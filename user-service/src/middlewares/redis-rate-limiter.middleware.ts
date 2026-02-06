import { NextFunction, Request, Response } from 'express';

import { TooManyRequestsException } from '@common/exceptions/too-many-requests.exception';
import { getUserRateLimiter } from '@libs/limiter/user-rate.limiter';

export async function rateLimiterRedisMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const limiter = getUserRateLimiter();

    const key = await limiter.consume(
      req.signedCookies['refreshToken'] ?? req.ip ?? 'anonymous',
    );

    res.set({
      'X-User-RateLimit-Limit': limiter.points,
      'X-User-RateLimit-Remaining': key.remainingPoints,
      'X-User-RateLimit-Reset': key.msBeforeNext / 1000,
    });

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }

    next(
      new TooManyRequestsException('Too many requests, please try again later'),
    );
  }
}
