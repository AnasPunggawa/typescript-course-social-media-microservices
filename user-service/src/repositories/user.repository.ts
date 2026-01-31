import type { UserRegister, UserStored } from '@common/types/user.type';
import { User } from '@models/user.model';

export class UserRepository {
  public static async register(data: UserRegister): Promise<UserStored> {
    return User.create(data);
  }

  public static async selectUserByUsername(
    username: string,
  ): Promise<UserStored | null> {
    return User.findOne({
      username,
    }).lean();
  }

  public static async selectUsers(): Promise<UserStored[]> {
    return User.find({}).select({ __v: 0, password: 0 }).lean();
  }
}
