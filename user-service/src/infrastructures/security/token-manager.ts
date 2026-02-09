import { type JwtPayload, sign, verify } from 'jsonwebtoken';

import {
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from '@common/constants/token.constant';
import { EnvConfig } from '@common/types/env.type';
import type {
  AccessTokenPayloadSign,
  RefreshTokenPayloadSign,
  TokenConfig,
  TokenPayloadSign,
  TokenType,
} from '@common/types/refresh-token.type';

export class JWTManager {
  private static config: Readonly<Record<TokenType, TokenConfig>> | undefined;

  private static getConfig(): Readonly<Record<TokenType, TokenConfig>> {
    if (!JWTManager.config) {
      throw new Error('JWTManager not initialized');
    }

    return JWTManager.config;
  }

  public static init(env: EnvConfig): void {
    JWTManager.config = {
      ACCESS: {
        secret: env['JWT_ACCESS_SECRET'],
        defaultExpiresIn: ACCESS_TOKEN_TTL_MS,
      },
      REFRESH: {
        secret: env['JWT_REFRESH_SECRET'],
        defaultExpiresIn: REFRESH_TOKEN_TTL_MS,
      },
    };
  }

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
    const { secret, defaultExpiresIn } = JWTManager.getConfig()[type];

    return sign(payload, secret, {
      expiresIn: Math.floor((expiresIn ?? defaultExpiresIn) / 1000),
    });
  }

  private static verifyToken(type: TokenType, token: string): JwtPayload {
    const { secret } = JWTManager.getConfig()[type];

    return verify(token, secret) as JwtPayload;
  }
}
