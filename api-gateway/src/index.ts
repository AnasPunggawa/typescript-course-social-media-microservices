import 'dotenv/config';
import type { Server } from 'node:http';
import process from 'node:process';

import { loadEnv } from '@configs/env.config';
import { setupRuntimeDirectories } from '@configs/runtime.config';
import { connection } from '@libs/db/connection.db';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { initLogger } from '@libs/logger/logger';
import type Redis from 'ioredis';
import { startServer } from './server';

let isShuttingDown: boolean = false;

let server: Server | undefined;
let redisConnection: Redis | undefined;

async function bootstraps(): Promise<void> {
  const env = loadEnv();

  await setupRuntimeDirectories();

  initLogger(env.NODE_ENV);

  const connections = await connection();

  redisConnection = connections.redisConnection;

  server = startServer(env.SERVER_PORT, env.SERVER_HOST);
}

bootstraps().catch((error: unknown) => {
  logError('API Gateway Error', error, 'BOOTSTRAP');

  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  logInfo(`Received ${signal}`, 'SERVER_SHUTDOWN');

  if (!server && !redisConnection) {
    process.exitCode = 0;

    return;
  }

  const forceExitTimer = setTimeout(() => {
    process.exit(process.exitCode ?? 1);
  }, 1000 * 10); // 10 seconds

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error?: Error) => {
          if (error) {
            return reject(error);
          }

          logInfo('HTTP Server closed', 'SERVER_SHUTDOWN');

          resolve();
        });
      });
    }

    if (redisConnection) {
      await redisConnection.quit();

      logInfo('Redis closed', 'SERVER_SHUTDOWN');
    }

    process.exitCode = 0;

    clearTimeout(forceExitTimer);
  } catch (error: unknown) {
    logError('Shutdown failed', error, 'SERVER_SHUTDOWN');

    process.exitCode = 1;
  }
}

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

process.on('uncaughtException', (error) => {
  logError('uncaughtException', error, 'SERVER');

  shutdown('uncaughtException').finally(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (error) => {
  logError('unhandledRejection', error, 'SERVER');

  shutdown('unhandledRejection').finally(() => {
    process.exit(1);
  });
});
