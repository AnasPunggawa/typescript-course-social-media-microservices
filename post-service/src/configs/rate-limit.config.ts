import rateLimit from 'express-rate-limit';
import RedisStore, { type RedisReply } from 'rate-limit-redis';

import { TooManyRequestsException } from '@common/exceptions/too-many-requests.exception';
import { getRedis } from '@libs/db/redis.db';

export function apiRateLimit(
  limitRequests: number = 100,
  timeMs: number = 1000 * 60 * 10,
) {
  return rateLimit({
    windowMs: timeMs,
    limit: limitRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_req, _res, next, opt) {
      return next(new TooManyRequestsException(opt.message));
    },

    // Redis
    store: new RedisStore({
      prefix: 'rl:service:posts',
      async sendCommand(command: string, ...args: string[]) {
        return getRedis().call(command, args) as Promise<RedisReply>;
      },
    }),
  });
}
