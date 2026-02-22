import type { NextFunction, Request, Response } from 'express';
import { type JwtPayload, verify } from 'jsonwebtoken';
import { readFileSync } from 'node:fs';

import { UnauthenticatedException } from '@common/exceptions/unauthenticated.exception';
import { JWT_ACCESS_PUBLIC_KEY_FILE } from '@configs/paths.config';

export function authenticationMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const JWT_ACCESS_PUBLIC_KEY = readFileSync(JWT_ACCESS_PUBLIC_KEY_FILE);

    const auth = req.get('authorization');

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthenticatedException('Unauthenticated');
    }

    const token = auth.split(' ')[1];

    if (!token) {
      throw new UnauthenticatedException('Unauthenticated');
    }

    const verifiedToken = verify(token, JWT_ACCESS_PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as JwtPayload;

    req.user = {
      id: verifiedToken.sub as string,
    };

    next();
  } catch (error) {
    next(error);
  }
}
