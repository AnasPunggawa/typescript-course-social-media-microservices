import type { Handler, NextFunction, Request, Response } from 'express';

import { TooManyRequestsException } from '@common/exceptions/too-many-requests.exception';
import { Limiter } from '@common/types/rate-limit.type';
import { PostLimiter } from '@libs/limiters/post.limiter';
import { RateLimiterRes } from 'rate-limiter-flexible';

export function redisRateLimiterMiddleware(name: Limiter): Handler {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const limiter = PostLimiter.getLimiter(name);

      const key = req.get('X-User-Id') ?? req.ip ?? 'anonymous';

      const result = await limiter.consume(key);

      res.set({
        'X-Post-RateLimit-Policy': `q=${limiter.points};w=${limiter.duration}`,
        'X-Post-RateLimit-Limit': limiter.points,
        'X-Post-RateLimit-Remaining': result.remainingPoints,
        'X-Post-RateLimit-Reset': Math.ceil(result.msBeforeNext / 1000),
      });

      next();
    } catch (error: unknown) {
      if (error instanceof RateLimiterRes) {
        res.set({
          'X-Post-Retry-After': String(Math.ceil(error.msBeforeNext / 1000)),
        });

        return next(
          new TooManyRequestsException(
            'Too many requests, please try again later',
          ),
        );
      }

      next(error);
    }
  };
}
