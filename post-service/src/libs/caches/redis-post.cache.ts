import { PostPaginationQuery } from '@common/types/post.type';
import { getRedis } from '@libs/db/redis.db';

export class RedisPostCache {
  private static readonly PREFIX_ITEM_KEY = 'cache:post:item';
  private static readonly PREFIX_LIST_KEY = 'cache:post';
  public static readonly REDIS_KEY_VERSION = 'cache:post:version';

  public static buildItemKey(id: string): string {
    return `${RedisPostCache.PREFIX_ITEM_KEY}:${id}`;
  }

  public static buildListKey({
    page,
    size,
    sort,
    user,
    version,
  }: PostPaginationQuery & { version: string }): string {
    const userKey = user ? `u:${user.toString()}` : 'all';

    return `${RedisPostCache.PREFIX_LIST_KEY}:v${version}:list:${userKey}:p${page}:s${size}:s${sort[0]}`;
  }

  public static async getListVersion(): Promise<string> {
    const redisClient = getRedis();

    const version = await redisClient.get(RedisPostCache.REDIS_KEY_VERSION);

    if (!version) {
      await redisClient.set(RedisPostCache.REDIS_KEY_VERSION, '1', 'NX');

      return '1';
    }

    return version;
  }
}
