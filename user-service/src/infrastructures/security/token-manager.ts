import { type JwtPayload, sign, verify } from 'jsonwebtoken';
import { Buffer } from 'node:buffer';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { ACCESS_TOKEN_TTL_MS } from '@common/constants/token.constant';
import { EnvConfig } from '@common/types/env.type';
import type {
  AccessTokenConfig,
  AccessTokenPayloadSign,
  RefreshTokenConfig,
  TokenType,
} from '@common/types/refresh-token.type';
import { JWT_ACCESS_PRIVATE_KEY_FILE } from '@configs/paths.config';

export class JWTManager {
  private static ACCESS_TOKEN_CONFIG: AccessTokenConfig | undefined;

  private static REFRESH_TOKEN_CONFIG: RefreshTokenConfig | undefined;

  private static getConfig(type: 'ACCESS'): AccessTokenConfig;
  private static getConfig(type: 'REFRESH'): RefreshTokenConfig;
  private static getConfig(type: TokenType) {
    if (!JWTManager.ACCESS_TOKEN_CONFIG || !JWTManager.REFRESH_TOKEN_CONFIG) {
      throw new Error('JWTManager not initialized');
    }

    if (type === 'ACCESS') {
      return JWTManager.ACCESS_TOKEN_CONFIG;
    }

    return JWTManager.REFRESH_TOKEN_CONFIG;
  }

  public static init(env: EnvConfig): void {
    const JWT_ACCESS_PRIVATE_KEY = readFileSync(
      JWT_ACCESS_PRIVATE_KEY_FILE,
      'utf8',
    );

    JWTManager.ACCESS_TOKEN_CONFIG = {
      algorithm: 'RS256',
      defaultExpiresIn: ACCESS_TOKEN_TTL_MS,
      secret: JWT_ACCESS_PRIVATE_KEY,
    };

    JWTManager.REFRESH_TOKEN_CONFIG = {
      algorithm: 'sha256',
      encoding: 'hex',
      randomBytesSize: 32,
      secret: env['JWT_REFRESH_SECRET'],
    };
  }

  public static signAccessToken(
    payload: AccessTokenPayloadSign,
    expiresIn?: number,
  ): string {
    const { algorithm, secret, defaultExpiresIn } =
      JWTManager.getConfig('ACCESS');

    return sign(payload, secret, {
      algorithm: algorithm,
      expiresIn: Math.floor((expiresIn ?? defaultExpiresIn) / 1000),
    });
  }

  public static signRefreshToken(): string {
    const { encoding, randomBytesSize } = JWTManager.getConfig('REFRESH');

    return randomBytes(randomBytesSize).toString(encoding);
  }

  public static hashRefreshToken(token: string): string {
    const { algorithm, encoding, secret } = JWTManager.getConfig('REFRESH');

    const data = token + secret;

    return createHash(algorithm).update(data).digest(encoding);
  }

  public static verifyAccessToken(token: string): JwtPayload {
    const { algorithm, secret } = JWTManager.getConfig('ACCESS');

    return verify(token, secret, {
      algorithms: [algorithm],
    }) as JwtPayload;
  }

  public static verifyRefreshToken(
    hashedToken: string,
    token: string,
  ): boolean {
    const { algorithm, encoding, secret } = JWTManager.getConfig('REFRESH');

    const data = token + secret;

    const computedHash = createHash(algorithm).update(data).digest();

    const storedHashBuffer = Buffer.from(hashedToken, encoding);

    if (computedHash.length !== storedHashBuffer.length) {
      return false;
    }

    return timingSafeEqual(computedHash, storedHashBuffer);
  }
}
