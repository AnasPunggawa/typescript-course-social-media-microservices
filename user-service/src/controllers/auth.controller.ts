import type { NextFunction, Request, Response } from 'express';

import type {
  UserLoginRequest,
  UserRegisterRequest,
} from '@common/types/user.type';
import { logInfo } from '@libs/logger/info.logger';
import { ResponseRefreshTokenCookie } from '@libs/responses/cookie-refresh-token.response';
import { responseSuccess } from '@libs/responses/success.response';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public static async postRegister(
    req: Request<{}, UserRegisterRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user, tokens } = await AuthService.register(req.body);

      ResponseRefreshTokenCookie.set({
        res,
        refreshToken: tokens.refreshToken,
      });

      responseSuccess({
        res,
        message: 'User Registered',
        statusCode: 201,
        data: { user, accessToken: tokens.accessToken },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async postLogin(
    req: Request<{}, UserLoginRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { accessToken, refreshToken } = await AuthService.login(req.body);

      ResponseRefreshTokenCookie.set({
        res,
        refreshToken: refreshToken,
      });

      responseSuccess({
        res,
        message: 'User Logged',
        statusCode: 200,
        data: {
          accessToken: accessToken,
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async getRefreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { accessToken, refreshToken } =
        await AuthService.reissueAccessToken(req.signedCookies['refreshToken']);

      ResponseRefreshTokenCookie.set({ res, refreshToken });

      responseSuccess({
        res,
        message: 'Access Token Rotated',
        statusCode: 200,
        data: {
          accessToken,
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async deleteLogout(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const message = await AuthService.logout(
        req.signedCookies['refreshToken'],
      );

      logInfo(
        `<${req.get('X-User-Id') ?? req.ip}> ${message}`,
        'AUTH_CONTROLLER_LOGOUT',
      );

      ResponseRefreshTokenCookie.clear(res);

      responseSuccess({
        res,
        statusCode: 200,
        message: 'User Logout',
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
