import type { UserPublic, UserStored } from '@common/types/user.type';

export class UserDTO {
  public static map(data: UserStored): UserPublic {
    return {
      id: data._id.toString(),
      name: data.name,
      username: data.username,
      email: data.email,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
