import { logError } from '@libs/logger/error.logger';
import c from 'cors';

export function cors(nodeEnv: string, allowedOrigins: string[]) {
  const whiteList = new Set<string>(
    nodeEnv === 'production' ? allowedOrigins : [],
  );

  return c({
    origin(requestOrigin, callback) {
      if (!requestOrigin || whiteList.has(requestOrigin)) {
        return callback(null, true);
      }

      logError(`Blocked Origin: ${requestOrigin}`, null, 'CORS');

      return callback(new Error('Not Allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
    maxAge: 60 * 60 * 12, // 12 hours
    optionsSuccessStatus: 204,
  });
}
