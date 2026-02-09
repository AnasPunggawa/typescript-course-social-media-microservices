import type { CookieOptions, Response } from 'express';

import { REFRESH_TOKEN_TTL_MS } from '@common/constants/token.constant';
import type { ResponseSignRefreshTokenCookie } from '@common/types/response.type';
import { loadEnv } from '@configs/env.config';

export class ResponseRefreshTokenCookie {
  private static getOptions(): Readonly<CookieOptions> {
    return {
      httpOnly: true,
      secure: loadEnv()['NODE_ENV'] === 'production',
      sameSite: 'strict',
      path: '/users',
      signed: true,
    } as const;
  }

  public static set({
    res,
    refreshToken,
  }: ResponseSignRefreshTokenCookie): Response {
    return res.cookie('refreshToken', refreshToken, {
      ...ResponseRefreshTokenCookie.getOptions(),
      maxAge: REFRESH_TOKEN_TTL_MS,
    });
  }

  public static clear(res: Response): Response {
    return res.clearCookie(
      'refreshToken',
      ResponseRefreshTokenCookie.getOptions(),
    );
  }
}
