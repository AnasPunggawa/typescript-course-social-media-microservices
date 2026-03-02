import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { apiRateLimit } from '@configs/rate-limit.config';
import { globalErrorMiddleware } from '@middlewares/global-error.middleware';
import { internalAuthMiddleware } from '@middlewares/internal-auth.middleware';
import { logMiddleware } from '@middlewares/log.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import { postRouter } from '@routes/post.route';

export function createApp(): Express {
  const app = express();

  app.use(apiRateLimit());
  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(logMiddleware);

  app.use('/api/posts', internalAuthMiddleware, postRouter);

  app.use(notFoundURLMiddleware);

  app.use(globalErrorMiddleware);

  return app;
}
