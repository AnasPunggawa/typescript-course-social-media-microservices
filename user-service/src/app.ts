import express, { json, type Express } from 'express';
import helmet from 'helmet';
import { errorGlobalMiddleware, notFoundURLMiddleware } from './middlewares';
import { userRouter } from './routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(json());

  app.use('/users', userRouter);

  app.use(notFoundURLMiddleware);

  app.use(errorGlobalMiddleware);

  return app;
}
