import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { cors } from '@configs/cors.config';
import { loadEnv } from '@configs/env.config';
import { apiRateLimit } from '@configs/rate-limit.config';
import { errorGlobalMiddleware } from '@middlewares/error-global.middleware';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import { proxyMiddleware } from '@middlewares/proxy.middleware';
import { authenticationMiddleware } from './middlewares/authentication.middleware';

export function createApp(): Express {
  const {
    ALLOWED_ORIGINS,
    AUTH_SERVICE_URL,
    NODE_ENV,
    POST_SERVICE_URL,
    USER_SERVICE_URL,
  } = loadEnv();

  const app = express();

  app.use(apiRateLimit());
  app.use(helmet());
  app.use(cors(NODE_ENV, ALLOWED_ORIGINS));
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(loggerMiddleware);

  app.use(
    '/api/v1/auth',
    proxyMiddleware({
      target: AUTH_SERVICE_URL,
      service: 'USER_SERVICE_AUTH',
      pathRewrite: {
        '/api/v1/auth': '/api/auth',
      },
    }),
  );

  app.use(
    '/api/v1/users',
    authenticationMiddleware,
    proxyMiddleware({
      target: USER_SERVICE_URL,
      service: 'USER_SERVICE',
      pathRewrite: {
        '/api/v1/users': '/api/users',
      },
    }),
  );

  app.use(
    '/api/v1/posts',
    authenticationMiddleware,
    proxyMiddleware({
      target: POST_SERVICE_URL,
      service: 'POST_SERVICE',
      pathRewrite: {
        '/api/v1/posts': '/api/posts',
      },
    }),
  );

  app.use(notFoundURLMiddleware);

  app.use(errorGlobalMiddleware);

  return app;
}
