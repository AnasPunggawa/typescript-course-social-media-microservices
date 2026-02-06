import { RateLimiterRedis } from 'rate-limiter-flexible';

import { getRedis } from '@libs/db/redis.db';

let rateLimiterRedis: RateLimiterRedis | undefined;

export function initUserLimiter() {
  const limiter = new RateLimiterRedis({
    storeClient: getRedis(),
    keyPrefix: 'user_service',
    points: 10, // 10 requests
    duration: 60, // 10 requests/60 seconds
    blockDuration: 30, // blocked for 30 seconds after exceed
  });

  rateLimiterRedis = limiter;
}

export function getUserRateLimiter() {
  if (!rateLimiterRedis) {
    throw new Error('User rate limiter not initialized');
  }

  return rateLimiterRedis;
}
