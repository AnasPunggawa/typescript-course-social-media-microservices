import { loadEnv } from '@configs/env.config';
import { initRedis } from './redis.db';

export async function connection() {
  const { REDIS_HOST, REDIS_PORT } = loadEnv();

  const redisConnection = await initRedis(REDIS_PORT, REDIS_HOST);

  return {
    redisConnection,
  };
}
