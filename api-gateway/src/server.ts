import { createServer, type Server } from 'node:http';

import { loadEnv } from '@configs/env.config';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { createApp } from './app';

export function startServer(PORT: number, HOST: string): Server {
  const app = createApp();
  const { AUTH_SERVICE_URL, POST_SERVICE_URL, USER_SERVICE_URL } = loadEnv();

  const server = createServer(app);

  server.on('error', (error: Error) => {
    logError('Server Error', error, 'SERVER');

    throw error;
  });

  server.listen(PORT, HOST, () => {
    logInfo(`Server is running on http://${HOST}:${PORT}`, 'SERVER');
    logInfo(`Auth Service is running on ${AUTH_SERVICE_URL}`, 'SERVICE');
    logInfo(`User Service is running on ${USER_SERVICE_URL}`, 'SERVICE');
    logInfo(`Post Service is running on ${POST_SERVICE_URL}`, 'SERVICE');
  });

  return server;
}
