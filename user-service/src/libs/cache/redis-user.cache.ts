import { getRedis } from '@libs/db/redis.db';

export class RedisUserCache {
  private static readonly PREFIX_USER_KEY = 'cache:user';
  private static readonly REDIS_KEY_VERSION = 'cache:user:version';

  public static buildUserKey(id: string): string {
    return `${RedisUserCache.PREFIX_USER_KEY}:${id}`;
  }

  public static buildUsersKey(version: string): string {
    return `${RedisUserCache.PREFIX_USER_KEY}:v${version}:list`;
  }

  public static async getListVersion(): Promise<string> {
    const redisClient = getRedis();

    const version = await redisClient.get(RedisUserCache.REDIS_KEY_VERSION);

    if (!version) {
      await redisClient.set(RedisUserCache.REDIS_KEY_VERSION, '1', 'NX');

      return '1';
    }

    return version;
  }

  public static async incrListVersion(): Promise<void> {
    await getRedis().incr(RedisUserCache.REDIS_KEY_VERSION);
  }
}
