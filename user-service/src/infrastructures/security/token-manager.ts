import { type JwtPayload, sign, verify } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';

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
import { JWT_ACCESS_PRIVATE_KEY_FILE } from '@configs/paths.config';

export class JWTManager {
  private static config: Readonly<Record<TokenType, TokenConfig>> | undefined;

  private static getConfig(): Readonly<Record<TokenType, TokenConfig>> {
    if (!JWTManager.config) {
      throw new Error('JWTManager not initialized');
    }

    return JWTManager.config;
  }

  public static init(env: EnvConfig): void {
    const JWT_ACCESS_PRIVATE_KEY = readFileSync(
      JWT_ACCESS_PRIVATE_KEY_FILE,
      'utf8',
    );

    JWTManager.config = {
      ACCESS: {
        secret: JWT_ACCESS_PRIVATE_KEY,
        defaultExpiresIn: ACCESS_TOKEN_TTL_MS,
        algorithm: 'RS256',
      },
      REFRESH: {
        secret: env['JWT_REFRESH_SECRET'],
        defaultExpiresIn: REFRESH_TOKEN_TTL_MS,
        algorithm: 'HS256',
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
    const { secret, defaultExpiresIn, algorithm } =
      JWTManager.getConfig()[type];

    return sign(payload, secret, {
      algorithm,
      expiresIn: Math.floor((expiresIn ?? defaultExpiresIn) / 1000),
    });
  }

  private static verifyToken(type: TokenType, token: string): JwtPayload {
    const { secret, algorithm } = JWTManager.getConfig()[type];

    return verify(token, secret, {
      algorithms: [algorithm],
    }) as JwtPayload;
  }
}
