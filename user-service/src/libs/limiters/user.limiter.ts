import { RateLimiterRedis } from 'rate-limiter-flexible';

import type {
  Limiter,
  RateLimitRedisConfig,
} from '@common/types/rate-limit.type';
import { getRedis } from '@libs/db/redis.db';

export class UserLimiter {
  private static readonly limiters = new Map<Limiter, RateLimiterRedis>();

  private static readonly CONFIGS: Record<Limiter, RateLimitRedisConfig> = {
    register: {
      keyPrefix: 'rl:register',
      points: 6, // 6 requests
      duration: 60, // 6 requests/60 seconds
      blockDuration: 30, // blocked for 30 seconds,
    },
    login: {
      keyPrefix: 'rl:login',
      points: 6,
      duration: 60,
      blockDuration: 30,
    },
    refresh: {
      keyPrefix: 'rl:refresh',
      points: 5,
      duration: 30,
      blockDuration: 30,
    },
    logout: {
      keyPrefix: 'rl:logout',
      points: 5,
      duration: 30,
      blockDuration: 30,
    },
    auth: {
      keyPrefix: 'rl:auth',
      points: 10,
      duration: 60,
      blockDuration: 30,
    },
  } as const;

  public static initLimiters(): void {
    (Object.keys(UserLimiter.CONFIGS) as Limiter[]).forEach((key) => {
      UserLimiter.limiters.set(
        key,
        UserLimiter.createLimiter(UserLimiter.CONFIGS[key]),
      );
    });
  }

  public static getLimiter(name: Limiter): RateLimiterRedis {
    const limiter = UserLimiter.limiters.get(name);

    UserLimiter.assertLimiter(limiter, `Limiter ${name} not initialized`);

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

  private static assertLimiter(
    limiter: unknown,
    message: string,
  ): asserts limiter is RateLimiterRedis {
    if (!limiter) {
      throw new Error(message);
    }
  }
}
