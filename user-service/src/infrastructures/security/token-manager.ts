import { JwtPayload, sign, verify } from 'jsonwebtoken';

import {
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from '@common/constants/token.constant';
import type {
  AccessTokenPayloadSign,
  RefreshTokenPayloadSign,
  TokenPayloadSign,
} from '@common/types/refresh-token.type';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@configs/env.config';

type TokenType = 'ACCESS' | 'REFRESH';

type TokenConfig = {
  secret: string;
  defaultExpiresIn: number;
};

export class JWTManager {
  private static readonly TOKEN_CONFIG: Record<TokenType, TokenConfig> = {
    ACCESS: {
      secret: JWT_ACCESS_SECRET,
      defaultExpiresIn: ACCESS_TOKEN_TTL_MS,
    },
    REFRESH: {
      secret: JWT_REFRESH_SECRET,
      defaultExpiresIn: REFRESH_TOKEN_TTL_MS,
    },
  };

  public static signAccessToken(
    payload: AccessTokenPayloadSign,
    expiresIn?: number,
  ): string {
    return JWTManager.signToken('ACCESS', payload, expiresIn);
  }

  public static signRefreshToken(
    payload: RefreshTokenPayloadSign,
    expiresIn?: number,
  ): string {
    return JWTManager.signToken('REFRESH', payload, expiresIn);
  }

  public static verifyAccessToken(token: string): JwtPayload {
    return JWTManager.verifyToken('ACCESS', token);
  }

  public static verifyRefreshToken(token: string): JwtPayload {
    return JWTManager.verifyToken('REFRESH', token);
  }

  private static signToken(
    type: TokenType,
    payload: TokenPayloadSign,
    expiresIn?: number,
  ): string {
    const { secret, defaultExpiresIn } = JWTManager.TOKEN_CONFIG[type];

    return sign(payload, secret, {
      expiresIn: Math.floor((expiresIn ?? defaultExpiresIn) / 1000),
    });
  }

  private static verifyToken(type: TokenType, token: string): JwtPayload {
    const { secret } = JWTManager.TOKEN_CONFIG[type];

    return verify(token, secret) as JwtPayload;
  }
}
