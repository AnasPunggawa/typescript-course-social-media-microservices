import type { NextFunction, Request, Response } from 'express';

import type {
  UserLoginRequest,
  UserRegisterRequest,
} from '@common/types/user.type';
import { ResponseRefreshTokenCookie } from '@libs/responses/cookie-refresh-token.response';
import { responseSuccess } from '@libs/responses/success.response';
import { UserService } from '@services/user.service';

export class UserController {
  public static async postRegister(
    req: Request<{}, UserRegisterRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user, tokens } = await UserService.register(req.body);

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
      const tokens = await UserService.login(req.body);

      ResponseRefreshTokenCookie.set({
        res,
        refreshToken: tokens.refreshToken,
      });

      responseSuccess({
        res,
        message: 'User Logged',
        statusCode: 200,
        data: {
          accessToken: tokens.accessToken,
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
      const accessToken = await UserService.reissueAccessToken(
        req.signedCookies['refreshToken'],
      );

      responseSuccess({
        res,
        message: 'Access token rotated',
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
      await UserService.logout(req.signedCookies['refreshToken']);

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

  public static async getUsers(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const users = await UserService.getUsers();

      res.set('X-Some-Custom-Header', 'Fetch All Users');

      responseSuccess({
        res,
        message: 'Fetch all users',
        statusCode: 200,
        data: { users },
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
