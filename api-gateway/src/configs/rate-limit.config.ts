import rateLimit from 'express-rate-limit';
import { type RedisReply, RedisStore } from 'rate-limit-redis';

import { TooManyRequestException } from '@common/exceptions/too-many-requests.exception';
import { getRedis } from '@libs/db/redis.db';

export function apiRateLimit(
  limitRequest: number = 100, // 100 requests
  timeMs: number = 1000 * 60 * 2, // 100 requests/2 minutes
) {
  return rateLimit({
    limit: limitRequest,
    windowMs: timeMs,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, _res, next, options) {
      return next(new TooManyRequestException(options.message));
    },

    // Redis
    store: new RedisStore({
      prefix: 'rl:gateway',
      sendCommand(command, ...args: string[]) {
        return getRedis().call(command, args) as Promise<RedisReply>;
      },
    }),
  });
}
