import type { NextFunction, Request, Response } from 'express';
import { REFRESH_TOKEN_TTL_MS } from '../common/constants';
import type {
  UserLoginRequest,
  UserRegisterRequest,
} from '../common/types/user.type';
import { NODE_ENV } from '../configs/env.config';
import { responseSuccess } from '../libs/responses';
import { UserService } from '../services/user.service';

export class UserController {
  public static async postRegister(
    req: Request<{}, UserRegisterRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await UserService.register(req.body);

      responseSuccess({
        res,
        message: 'User Registered',
        statusCode: 201,
        data: { user },
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
      const token = await UserService.login(req.body);

      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production' ? true : false,
        sameSite: 'strict',
        path: '/users',
        maxAge: REFRESH_TOKEN_TTL_MS,
        signed: true,
      });
      responseSuccess({
        res,
        message: 'User Logged',
        statusCode: 200,
        data: {
          accessToken: token.accessToken,
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
