import { createServer, Server } from 'node:http';

import { createApp } from './app';

export function startServer(PORT: number, HOST: string): Server {
  const app = createApp();

  const server = createServer(app);

  server.on('error', (error: Error) => {
    console.error('Server Error', error);

    throw error;
  });

  server.listen(PORT, HOST, () => {
    console.info(`Service is running on http://${HOST}:${PORT}`);
  });

  return server;
}
