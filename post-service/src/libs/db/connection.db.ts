import { loadEnv } from '@configs/env.config';
import { initMongoDB } from './mongo.db';
import { initRedis } from './redis.db';

export async function connection() {
  const { MONGO_URI, REDIS_HOST, REDIS_PORT } = loadEnv();

  const redisConnection = await initRedis(REDIS_PORT, REDIS_HOST);

  const mongodbConnection = await initMongoDB(MONGO_URI);

  return {
    redisConnection,
    mongodbConnection,
  };
}
