import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { cors } from '@configs/cors.config';
import { loadEnv } from '@configs/env.config';
import { apiRateLimit } from '@configs/rate-limit.config';
import { errorGlobalMiddleware } from '@middlewares/error-global.middleware';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import { proxyMiddleware } from '@middlewares/proxy.middleware';

export function createApp(): Express {
  const { NODE_ENV, ALLOWED_ORIGINS, AUTH_SERVICE_URL, USER_SERVICE_URL } =
    loadEnv();

  const app = express();

  app.use(apiRateLimit());
  app.use(helmet());
  app.use(cors(NODE_ENV, ALLOWED_ORIGINS));
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(loggerMiddleware);

  app.use('/api/auth', proxyMiddleware(AUTH_SERVICE_URL, 'USER_SERVICE_AUTH'));

  app.use('/api/users', proxyMiddleware(USER_SERVICE_URL, 'USER_SERVICE'));

  app.use(notFoundURLMiddleware);

  app.use(errorGlobalMiddleware);

  return app;
}
