import type {
  UserCreateRequest,
  UserPublic,
  UserStored,
} from '../common/types/user.type';
import { UserSchema } from '../common/validations';
import { Argon2PasswordManager } from '../infrastructures/security';
import { UserRepository } from '../repositories';

export class UserService {
  public static async create(
    userRequest: UserCreateRequest,
  ): Promise<UserPublic> {
    const userCreate = UserSchema.create.parse(userRequest);

    const hashedPassword = await Argon2PasswordManager.hash(
      userCreate.password,
    );

    userCreate['password'] = hashedPassword;

    const user = await UserRepository.create(userCreate);

    return UserService.map(user);
  }

  public static async getUsers(): Promise<UserPublic[]> {
    const users = await UserRepository.selectUsers();

    return users.map((user) => UserService.map(user));
  }

  private static map(data: UserStored): UserPublic {
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
