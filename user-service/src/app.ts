import cookieParser from 'cookie-parser';
import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { COOKIE_SECRET } from '@configs/env.config';
import { errorGlobalMiddleware } from '@middlewares/global-error.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import { userRouter } from '@routes/user.route';

export function createApp(): Express {
  const app = express();

  app.use(cookieParser(COOKIE_SECRET));

  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use('/users', userRouter);

  app.use(notFoundURLMiddleware);

  app.use(errorGlobalMiddleware);

  return app;
}
