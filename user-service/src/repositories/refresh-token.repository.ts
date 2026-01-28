import type {
  RefreshTokenStore,
  RefreshTokenStored,
} from '../common/types/refresh-token.type';
import { RefreshToken } from '../models';

export class RefreshTokenRepository {
  public static async store(
    data: RefreshTokenStore,
  ): Promise<RefreshTokenStored> {
    return RefreshToken.create(data);
  }

  public static selectToken(
    token: string,
  ): Promise<Omit<RefreshTokenStored, '__v'> | null> {
    return RefreshToken.findOne(
      {
        token,
      },
      {
        __v: 0,
      },
    ).lean();
  }
}
