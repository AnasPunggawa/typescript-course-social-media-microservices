import type { NextFunction, Request, Response } from 'express';

import { responseSuccess } from '@libs/responses/success.response';
import { UserService } from '@services/user.service';

export class UserController {
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
        message: 'Fetch All Users',
        statusCode: 200,
        data: { users },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async getCurrent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await UserService.getCurrent(req.get('X-User-Id'));

      responseSuccess({
        res,
        message: 'Fetch Current User',
        statusCode: 200,
        data: { user },
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
