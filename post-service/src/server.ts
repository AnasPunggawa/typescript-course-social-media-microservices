import { type Server, createServer } from 'node:http';

import { logError } from '@libs/logger/error.log';
import { logInfo } from '@libs/logger/info.logger';
import { createApp } from './app';

export async function startServer(PORT: number, HOST: string): Promise<Server> {
  const app = createApp();

  const server = createServer(app);

  server.on('error', (error: Error) => {
    logError('Server Error', error, 'SERVER');

    throw error;
  });

  server.listen(PORT, HOST, () => {
    logInfo(`Service is running on http://${HOST}:${PORT}`, 'SERVER');
  });

  return server;
}
