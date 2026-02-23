import type {
  RefreshTokenPublic,
  RefreshTokenStore,
  RefreshTokenStored,
} from '@common/types/refresh-token.type';
import { RefreshToken } from '@models/refresh-token.model';

export class RefreshTokenRepository {
  public static async store(
    data: RefreshTokenStore,
  ): Promise<RefreshTokenStored> {
    return RefreshToken.create(data);
  }

  public static async selectToken(
    token: string,
  ): Promise<RefreshTokenPublic | null> {
    return RefreshToken.findOne({
      token,
    })
      .select({ __v: 0 })
      .lean();
  }

  public static async deleteToken(
    token: string,
  ): Promise<RefreshTokenPublic | null> {
    return RefreshToken.findOneAndDelete({
      token,
    })
      .select({ __v: 0 })
      .lean();
  }
}
