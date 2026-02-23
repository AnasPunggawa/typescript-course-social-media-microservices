import { UserDTO } from '@common/dto/user.dto';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import type { UserPublic } from '@common/types/user.type';
import { UserSchema } from '@common/validations/user.schema';
import { UserRepository } from '@repositories/user.repository';

export class UserService {
  public static async getUsers(): Promise<UserPublic[]> {
    const users = await UserRepository.selectUsers();

    return users.map((user) => UserDTO.map(user));
  }

  public static async getCurrent(id: string | undefined): Promise<UserPublic> {
    const userId = UserSchema.id.parse(id);

    const user = await UserRepository.selectUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserDTO.map(user);
  }
}
