import c from 'cors';

import { NodeEnv } from '@common/types/env.type';
import { logError } from '@libs/logger/error.logger';

export function cors(NODE_ENV: NodeEnv, ALLOWED_ORIGINS: string[]) {
  const whitelist = new Set<string>(
    NODE_ENV === 'production' ? ALLOWED_ORIGINS : [],
  );

  return c({
    origin(requestOrigin, callback) {
      if (!requestOrigin || whitelist.has(requestOrigin)) {
        return callback(null, true);
      }

      logError(`Blocked Origin: ${requestOrigin}`, null, 'CORS');
      return callback(new Error('Not Allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-User-Id'],
    exposedHeaders: ['X-Some-Custom-Header'],
    credentials: true,
    maxAge: 60 * 60 * 12, // 12 hours
    optionsSuccessStatus: 204,
  });
}
