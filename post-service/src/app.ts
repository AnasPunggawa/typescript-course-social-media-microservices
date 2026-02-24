import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { apiRateLimit } from '@configs/rate-limit.config';
import { responseSuccess } from '@libs/responses/success.response';
import { globalErrorMiddleware } from '@middlewares/global-error.middleware';
import { logMiddleware } from '@middlewares/log.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';

export function createApp(): Express {
  const app = express();

  app.use(apiRateLimit());
  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(logMiddleware);

  app.get('/', (_req, res) => {
    responseSuccess({ res, statusCode: 200, message: 'Post Service' });
  });

  app.use(notFoundURLMiddleware);

  app.use(globalErrorMiddleware);

  return app;
}
