import Redis from 'ioredis';

import { UserLimiter } from '@libs/limiters/user.limiter';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';

let redisClient: Redis | undefined;

function waitForRedisReady(
  redisClient: Redis,
  timeoutMs: number = 1000 * 10, // 10 seconds
): Promise<Redis> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Redis connection timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    function onConnecting() {
      logInfo('Connecting to Redis...', 'REDIS');
    }

    function onReady() {
      logInfo('Redis connected', 'REDIS');
      cleanup();
      resolve(redisClient);
    }

    function onError(error: unknown) {
      cleanup();
      logError('Redis connection failed', error, 'REDIS');
      reject(error);
    }

    function cleanup() {
      clearTimeout(timer);
      redisClient.off('connecting', onConnecting);
      redisClient.off('ready', onReady);
      redisClient.off('error', onError);
    }

    redisClient.once('connecting', onConnecting);
    redisClient.once('ready', onReady);
    redisClient.once('error', onError);
  });
}

export async function initRedis(
  REDIS_PORT: number,
  REDIS_HOST: string,
): Promise<Redis> {
  if (redisClient) {
    return redisClient;
  }

  const client = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    enableReadyCheck: true,
    maxRetriesPerRequest: null,
  });

  redisClient = await waitForRedisReady(client);

  UserLimiter.initLimiters();

  client.on('error', (error) => {
    logError('Redis Runtime Error', error, 'RUNTIME_REDIS');
  });

  return client;
}

export function getRedis(): Redis {
  if (!redisClient) {
    throw new Error('Redis not initialized');
  }

  return redisClient;
}
