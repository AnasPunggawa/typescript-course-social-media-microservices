import express, { json, urlencoded, type Express } from 'express';
import helmet from 'helmet';

import { cors } from '@configs/cors.config';
import { loadEnv } from '@configs/env.config';
import { errorGlobalMiddleware } from '@middlewares/error-global.middleware';

export function createApp(): Express {
  const { NODE_ENV, ALLOWED_ORIGINS } = loadEnv();

  const app = express();

  app.use(helmet());
  app.use(cors(NODE_ENV, ALLOWED_ORIGINS));
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'API Gateway',
    });
  });

  app.use(errorGlobalMiddleware);

  return app;
}
