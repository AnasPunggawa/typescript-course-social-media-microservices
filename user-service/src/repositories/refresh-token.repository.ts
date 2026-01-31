import { DeleteResult } from 'mongoose';

import type {
  RefreshTokenPublic,
  RefreshTokenStore,
  RefreshTokenStored,
  TokenAndUserId,
} from '@common/types/refresh-token.type';
import { RefreshToken } from '@models/refresh-token.model';

export class RefreshTokenRepository {
  public static async store(
    data: RefreshTokenStore,
  ): Promise<RefreshTokenStored> {
    return RefreshToken.create(data);
  }

  public static async selectTokenByTokenAndUserId({
    token,
    user,
  }: TokenAndUserId): Promise<RefreshTokenPublic | null> {
    return RefreshToken.findOne({
      token,
      user,
    })
      .select({ __v: 0 })
      .lean();
  }

  public static async deleteTokenByTokenAndUserId({
    token,
    user,
  }: TokenAndUserId): Promise<DeleteResult> {
    return RefreshToken.deleteOne({
      token,
      user,
    }).lean();
  }
}
