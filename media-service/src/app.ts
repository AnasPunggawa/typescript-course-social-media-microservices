import express, { Express, json, urlencoded } from 'express';
import helmet from 'helmet';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Media Service OK',
    });
  });

  return app;
}
