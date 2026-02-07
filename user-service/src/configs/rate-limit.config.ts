import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';

import { TooManyRequestsException } from '@common/exceptions/too-many-requests.exception';
import { getRedis } from '@libs/db/redis.db';

export function apiRateLimit(
  limitRequests: number = 100, // number of limit requests based on timeMs
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

    // Redis
    store: new RedisStore({
      async sendCommand(command: string, ...args: string[]) {
        return getRedis().call(command, args) as Promise<RedisReply>;
      },
    }),
  });
}
