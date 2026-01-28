import { UserRegister, UserStored } from '../common/types/user.type';
import { User } from '../models';

export class UserRepository {
  public static async register(data: UserRegister): Promise<UserStored> {
    return User.create(data);
  }

  public static async selectUserByUsername(
    username: string,
  ): Promise<Pick<UserStored, '_id' | 'username' | 'password'> | null> {
    return User.findOne(
      {
        username,
      },
      {
        __id: 1,
        username: 1,
        password: 1,
      },
    ).lean();
  }

  public static async selectUsers(): Promise<UserStored[]> {
    return User.find({}, { __v: 0, password: 0 }).lean();
  }
}
