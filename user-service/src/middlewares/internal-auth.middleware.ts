import type { NextFunction, Request, Response } from 'express';

import { UnauthenticatedException } from '@common/exceptions/unauthenticated.exception';

export function internalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const userId = req.get('X-User-Id');

    if (!userId) {
      throw new UnauthenticatedException('Missing user identity');
    }

    req.user = {
      id: userId,
    };

    next();
  } catch (error: unknown) {
    next(error);
  }
}
