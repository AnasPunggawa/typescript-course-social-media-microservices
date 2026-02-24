import { responseSuccess } from '@libs/responses/success.response';
import { globalErrorMiddleware } from '@middlewares/global-error.middleware';
import { loggerMiddleware } from '@middlewares/logger.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(loggerMiddleware);

  app.get('/', (_req, res) => {
    responseSuccess({ res, statusCode: 200, message: 'Post Service' });
  });

  app.use(notFoundURLMiddleware);

  app.use(globalErrorMiddleware);

  return app;
}
