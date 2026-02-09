import { loadEnv } from '@configs/env.config';
import { initMongodb } from './mongo.db';
import { initRedis } from './redis.db';

export async function connection() {
  const { MONGO_URI, REDIS_HOST, REDIS_PORT } = loadEnv();

  const redisConnection = await initRedis(REDIS_PORT, REDIS_HOST);

  const mongooseConnection = await initMongodb(MONGO_URI);

  return {
    mongooseConnection,
    redisConnection,
  };
}
