import Redis from 'ioredis';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';

let redisClient: Redis | undefined;

async function waitForRedis(
  client: Redis,
  timeoutMs: number = 1000 * 10,
): Promise<Redis> {
  return new Promise((resolve, reject): void => {
    const timer = setTimeout((): void => {
      cleanUp();
      reject(new Error(`Redis connection timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    function onConnecting(): void {
      logInfo('Connecting to Redis...', 'REDIS');
    }

    function onReady(): void {
      logInfo('Redis connected', 'REDIS');
      cleanUp();
      resolve(client);
    }

    function onError(error: Error): void {
      logError('Redis connection failed', error, 'REDIS');
      cleanUp();
      reject(error);
    }

    function cleanUp(): void {
      clearTimeout(timer);
      client.off('connecting', onConnecting);
      client.off('ready', onReady);
      client.off('error', onError);
    }

    client.once('connecting', onConnecting);
    client.once('ready', onReady);
    client.once('error', onError);
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
    port: REDIS_PORT,
    host: REDIS_HOST,
    enableReadyCheck: true,
    maxRetriesPerRequest: null,
  });

  redisClient = await waitForRedis(client);

  redisClient.on('error', (error: Error) => {
    logError('Redis runtime error', error, 'RUNTIME_REDIS');
  });

  return redisClient;
}

export function getRedis(): Redis {
  if (!redisClient) {
    throw new Error('Redis not initialized');
  }

  return redisClient;
}
