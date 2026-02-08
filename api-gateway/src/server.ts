import { createServer, type Server } from 'node:http';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { createApp } from './app';

export function startServer(PORT: number, HOST: string): Server {
  const app = createApp();

  const server = createServer(app);

  server.on('error', (error: Error) => {
    logError('Server Error', error, 'SERVER');

    throw error;
  });

  server.listen(PORT, HOST, () => {
    logInfo(`Server is running on http://${HOST}:${PORT}`, 'SERVER');
  });

  return server;
}
