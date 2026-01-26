import type { NextFunction, Request, Response } from 'express';
import { responseSuccess } from '../libs/responses';
import { UserService } from '../services/user.service';

export class UserController {
  public static async post(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.create(req.body);

      responseSuccess({
        res,
        message: 'User Created',
        statusCode: 201,
        data: { user },
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
