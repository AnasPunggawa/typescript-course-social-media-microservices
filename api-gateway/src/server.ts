import { createServer, type Server } from 'node:http';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { createApp } from './app';

export function startServer(port: number, host: string): Server {
  const app = createApp();

  const server = createServer(app);

  server.on('error', (error: Error) => {
    logError('Server Error', error, 'SERVER');

    throw error;
  });

  server.listen(port, host, () => {
    logInfo(`Server is running on http://${host}:${port}`, 'SERVER');
  });

  return server;
}
