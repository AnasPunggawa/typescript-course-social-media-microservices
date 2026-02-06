import { initMongodb } from './mongo.db';
import { initRedis } from './redis.db';

export async function connection() {
  const redisConnection = await initRedis();

  const mongooseConnection = await initMongodb();

  return {
    mongooseConnection,
    redisConnection,
  };
}
