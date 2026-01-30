import cookieParser from 'cookie-parser';
import express, { json, type Express } from 'express';
import helmet from 'helmet';
import { COOKIE_SECRET } from './configs';
import { errorGlobalMiddleware, notFoundURLMiddleware } from './middlewares';
import { userRouter } from './routes';

export function createApp(): Express {
  const app = express();

  app.use(cookieParser(COOKIE_SECRET));

  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(json());

  app.use('/users', userRouter);

  app.use(notFoundURLMiddleware);

  app.use(errorGlobalMiddleware);

  return app;
}
