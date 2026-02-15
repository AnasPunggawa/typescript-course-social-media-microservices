import { Router } from 'express';

import { responseSuccess } from '@libs/responses/success.response';

export function authRouter(authURL: string) {
  const authRouter = Router();

  const endpoints = {
    login: `${authURL}/auth/login`,
  };

  // const allowedHeaders = new Set([
  //   'x-ratelimit-limit',
  //   'x-ratelimit-remaining',
  //   'x-ratelimit-reset',
  //   'retry-after',
  //   'set-cookie',
  // ]);

  authRouter.post('/register', async (_req, res, next) => {
    try {
      responseSuccess({
        res,
        statusCode: 201,
        message: 'user registered',
        data: {
          accessToken: 'some_token',
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  });

  authRouter.post('/login', async (req, res, next) => {
    try {
      const response = await fetch(endpoints['login'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      console.log(response.headers);

      for (const [key, value] of response.headers.entries()) {
        // if (allowedHeaders.has(key.toLowerCase())) {
        res.set(key, value);
        // }
      }

      const setCookie = response.headers.getSetCookie();

      if (setCookie && setCookie.length > 0) {
        res.set('set-cookie', setCookie);
      }

      const responseBody = await response.json();

      res.status(response.status).send(responseBody);
    } catch (error: unknown) {
      return next(error);
    }
  });

  authRouter.delete('/logout', async (_req, res, next) => {
    try {
      responseSuccess({
        res,
        statusCode: 200,
        message: 'user logout',
      });
    } catch (error: unknown) {
      next(error);
    }
  });

  return authRouter;
}
