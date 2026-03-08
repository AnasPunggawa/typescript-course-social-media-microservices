import { responseSuccess } from '@libs/responses/success.response';
import { globalErrorMiddleware } from '@middlewares/global-error.middleware';
import { logMiddleware } from '@middlewares/log.middleware';
import { notFoundURLMiddleware } from '@middlewares/not-found-url.middleware';
import express, { type Express, json, urlencoded } from 'express';
import helmet from 'helmet';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(logMiddleware);

  app.get('/', (_req, res) => {
    responseSuccess({ res, statusCode: 200, message: 'Media Service OK' });
  });

  app.use(notFoundURLMiddleware);

  app.use(globalErrorMiddleware);

  return app;
}
