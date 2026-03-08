import 'dotenv/config';
import { Server } from 'node:http';
import process from 'node:process';

import { loadEnv } from '@configs/env.config';
import { startServer } from './server';

let isShuttingDown: boolean = false;
let server: Server | undefined;

async function bootstrap(): Promise<void> {
  const { SERVER_HOST, SERVER_PORT } = loadEnv();

  server = startServer(SERVER_PORT, SERVER_HOST);
}

bootstrap().catch((error: unknown) => {
  console.error('Media Service Error', error);

  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.info(`Receive ${signal}`);

  if (!server) {
    process.exitCode = 0;

    return;
  }

  const forceExitTimer = setTimeout(() => {
    process.exit(process.exitCode ?? 1);
  }, 1000 * 10);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error: unknown) => {
          if (error) {
            return reject(error);
          }

          console.info('HTTP server closed');

          resolve();
        });
      });
    }

    process.exitCode = 0;

    clearTimeout(forceExitTimer);
  } catch (error: unknown) {
    console.error('Shutdown failed', error);

    process.exitCode = 1;
  }
}

process.on('SIGTERM', shutdown);

process.on('SIGINT', shutdown);

process.on('unhandledRejection', (error: unknown) => {
  console.error('unhandledRejection\n', error);

  shutdown('unhandledRejection').finally(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error: unknown) => {
  console.error('uncaughtException\n', error);

  shutdown('uncaughtException').finally(() => {
    process.exit(1);
  });
});
