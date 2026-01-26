import { UserCreate, UserStored } from '../common/types/user.type';
import { User } from '../models';

export class UserRepository {
  public static async create(data: UserCreate): Promise<UserStored> {
    return User.create(data);
  }

  public static async selectUsers(): Promise<UserStored[]> {
    return User.find({}, { __v: 0, password: 0 }).lean();
  }
}
