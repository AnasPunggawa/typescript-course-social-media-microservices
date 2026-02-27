import { RateLimiterRedis } from 'rate-limiter-flexible';

import type {
  Limiter,
  RateLimitRedisConfig,
} from '@common/types/rate-limit.type';
import { getRedis } from '@libs/db/redis.db';

export class PostLimiter {
  private static readonly limiters = new Map<Limiter, RateLimiterRedis>();

  private static readonly CONFIGS: Record<Limiter, RateLimitRedisConfig> = {
    create: {
      keyPrefix: 'rl:service:post:create', // prefix key in redis
      points: 5, // 5 requests
      duration: 60, // 5 requests/60 seconds
      blockDuration: 60, // block request for 60 seconds if the limits has reached
    },
    'get-posts': {
      keyPrefix: 'rl:service:post:get-posts',
      points: 15,
      duration: 60,
      blockDuration: 60,
    },
    'get-post': {
      keyPrefix: 'rl:service:post:get-post',
      points: 20,
      duration: 60,
      blockDuration: 60,
    },
    patch: {
      keyPrefix: 'rl:service:post:patch',
      points: 5,
      duration: 60,
      blockDuration: 60,
    },
    delete: {
      keyPrefix: 'rl:service:post:delete',
      points: 10,
      duration: 60,
      blockDuration: 60,
    },
  };

  public static initLimiters(): void {
    (Object.keys(PostLimiter.CONFIGS) as Limiter[]).forEach((key) => {
      const limiter = PostLimiter.createLimiter(PostLimiter.CONFIGS[key]);

      PostLimiter.limiters.set(key, limiter);
    });
  }

  public static getLimiter(name: Limiter): RateLimiterRedis {
    const limiter = PostLimiter.limiters.get(name);

    if (!limiter) {
      throw new Error(`Limiter ${name} not initialized`);
    }

    return limiter;
  }

  private static createLimiter({
    keyPrefix,
    points,
    duration,
    blockDuration,
  }: RateLimitRedisConfig): RateLimiterRedis {
    return new RateLimiterRedis({
      storeClient: getRedis(),
      keyPrefix,
      points,
      duration,
      blockDuration,
    });
  }
}
