import Redis from 'ioredis';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';

let redisClient: Redis | undefined;

async function waitForRedisReady(
  client: Redis,
  timeoutMs: number = 1000 * 10,
): Promise<Redis> {
  return new Promise<Redis>((resolve, reject) => {
    const timer = setTimeout(() => {}, timeoutMs);

    function onConnecting() {
      logInfo('Connecting to Redis...', 'REDIS');
    }

    function onError(error: unknown) {
      logError('Redis connection failed', error, 'REDIS');
      cleanup();

      return reject(error);
    }

    function onReady() {
      logInfo('Redis connected', 'REDIS');
      cleanup();

      return resolve(client);
    }

    function cleanup() {
      clearTimeout(timer);

      client.off('connecting', onConnecting);
      client.off('error', onError);
      client.off('ready', onReady);
    }

    client.once('connecting', onConnecting);
    client.once('error', onError);
    client.once('ready', onReady);
  });
}

export async function initRedis(PORT: number, HOST: string): Promise<Redis> {
  const client = new Redis({
    port: PORT,
    host: HOST,
    enableReadyCheck: true,
    maxRetriesPerRequest: null,
  });

  redisClient = await waitForRedisReady(client);

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
