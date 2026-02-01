import type { CorsOptions } from 'cors';

import { logError } from '@libs/logger/error.logger';
import { ALLOWED_ORIGINS, NODE_ENV } from './env.config';

const whitelist = new Set(
  NODE_ENV === 'production'
    ? ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [],
);

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin || whitelist.has(requestOrigin)) {
      return callback(null, true);
    }

    logError(`Blocked Origin: ${requestOrigin}`, null, 'CORS');
    return callback(new Error('Not Allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['X-Some-Custom-Header'],
  credentials: true,
  maxAge: 60 * 60 * 12, // 12 hours
  optionsSuccessStatus: 204,
};
