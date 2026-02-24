import 'dotenv/config';
import { type Server } from 'node:http';
import process from 'node:process';

import { loadEnv } from '@configs/env.config';
import { setupRuntimeDirectories } from '@configs/runtime.config';
import { logError } from '@libs/logger/error.log';
import { logInfo } from '@libs/logger/info.logger';
import { initLogger } from '@libs/logger/logger';
import { startServer } from './server';

let isShuttingDown: boolean = false;
let server: Server | undefined;

async function bootstrap() {
  const { NODE_ENV, SERVER_HOST, SERVER_PORT } = loadEnv();

  await setupRuntimeDirectories();

  initLogger(NODE_ENV);

  server = await startServer(SERVER_PORT, SERVER_HOST);
}

bootstrap().catch((error: unknown) => {
  logError('Post Service Error', error, 'BOOTSTRAP');

  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  logInfo(`Receive ${signal}`, 'SERVER_SHUTDOWN');

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
        server?.close((error) => {
          if (error) {
            return reject(error);
          }

          logInfo('HTTP server closed', 'SERVER_SHUTDOWN');

          resolve();
        });
      });
    }

    process.exitCode = 0;

    clearTimeout(forceExitTimer);
  } catch (error: unknown) {
    logError('Shutdown failed', error, 'SERVER_SHUTDOWN');

    process.exitCode = 1;
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('uncaughtException', (error: Error) => {
  logError('uncaughtException', error, 'SERVER');

  shutdown('uncaughtException').finally(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (error: Error) => {
  logError('unhandledRejection\n', error, 'SERVER');

  shutdown('unhandledRejection').finally(() => {
    process.exit(1);
  });
});
