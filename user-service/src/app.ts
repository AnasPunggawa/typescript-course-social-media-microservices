import cookieParser from 'cookie-parser';
import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { cors } from '@configs/cors.config';
import { loadEnv } from '@configs/env.config';
import { apiRateLimit } from '@configs/rate-limit.config';
import { errorGlobalMiddleware } from '@middlewares/global-error.middleware';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import { authRouter } from '@routes/auth.route';
import { userRouter } from '@routes/user.route';

export function createApp(): Express {
  const { ALLOWED_ORIGINS, COOKIE_SECRET, NODE_ENV } = loadEnv();

  const app = express();

  app.use(apiRateLimit());
  app.use(helmet());
  app.use(cors(NODE_ENV, ALLOWED_ORIGINS));
  app.use(cookieParser(COOKIE_SECRET));
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(loggerMiddleware);

  app.use('/', userRouter);

  app.use('/auth', authRouter);

  app.use(notFoundURLMiddleware);

  app.use(errorGlobalMiddleware);

  return app;
}
