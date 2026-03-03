import { UserDTO } from '@common/dto/user.dto';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import type { UserPublic } from '@common/types/user.type';
import { UserSchema } from '@common/validations/user.schema';
import { RedisUserCache } from '@libs/cache/redis-user.cache';
import { getRedis } from '@libs/db/redis.db';
import { UserRepository } from '@repositories/user.repository';

export class UserService {
  public static async getUsers(): Promise<UserPublic[]> {
    const cachedVersion = await RedisUserCache.getListVersion();

    const cachedKey = RedisUserCache.buildUsersKey(cachedVersion);

    const redisClient = getRedis();

    const cachedValue = await redisClient.get(cachedKey);

    if (cachedValue) {
      return JSON.parse(cachedValue) as UserPublic[];
    }

    const users = await UserRepository.selectUsers();

    const mappedUsers = users.map((user) => UserDTO.map(user));

    await redisClient.set(
      cachedKey,
      JSON.stringify(mappedUsers),
      'EX',
      60 * 15, // TTL 15 Minutes
    );

    return mappedUsers;
  }

  public static async getCurrent(id: string | undefined): Promise<UserPublic> {
    const userId = UserSchema.id.parse(id);

    const cachedKey = RedisUserCache.buildUserKey(userId.toString());

    const redisClient = getRedis();

    const cachedValue = await redisClient.get(cachedKey);

    if (cachedValue) {
      return JSON.parse(cachedValue) as UserPublic;
    }

    const user = await UserRepository.selectUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const mappedUser = UserDTO.map(user);

    await redisClient.set(cachedKey, JSON.stringify(mappedUser), 'EX', 60 * 10);

    return mappedUser;
  }
}
