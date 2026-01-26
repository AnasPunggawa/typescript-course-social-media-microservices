import { createServer, Server } from 'node:http';
import { createApp } from './app';
import { logError, logInfo } from './libs/logger';

export function startServer(PORT: number, HOST: string): Server {
  const app = createApp();

  const server = createServer(app);

  server.on('error', (error) => {
    logError('Server Error', error, 'SERVER');
  });

  server.listen(PORT, HOST, () => {
    logInfo(`service is running on http://${HOST}:${PORT}`, 'SERVER');
  });

  return server;
}
