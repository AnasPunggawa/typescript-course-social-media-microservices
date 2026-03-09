import 'dotenv/config';
import type Redis from 'ioredis';
import type { Mongoose } from 'mongoose';
import type { Server } from 'node:http';
import process from 'node:process';

import { loadEnv } from '@configs/env.config';
import { setupRuntimeDirectories } from '@configs/runtime.config';
import { connection } from '@libs/db/connection.db';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { initLogger } from '@libs/logger/logger';
import { startServer } from './server';

let isShuttingDown: boolean = false;
let mongodbConnection: Mongoose | undefined;
let redisConnection: Redis | undefined;
let server: Server | undefined;

async function bootstrap(): Promise<void> {
  const { NODE_ENV, SERVER_HOST, SERVER_PORT } = loadEnv();

  await setupRuntimeDirectories();

  initLogger(NODE_ENV);

  const connections = await connection();

  mongodbConnection = connections.mongodbConnection;
  redisConnection = connections.redisConnection;

  server = startServer(SERVER_PORT, SERVER_HOST);
}

bootstrap().catch((error: unknown) => {
  logError('Media Service Error', error, 'BOOTSTRAP');

  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  logInfo(`Receive ${signal}`, 'SERVER_SHUTDOWN');

  if (!server && !redisConnection && !mongodbConnection) {
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

          logInfo('HTTP server closed', 'SERVER_SHUTDOWN');

          resolve();
        });
      });
    }

    if (redisConnection) {
      logInfo('Redis closed', 'SERVER_SHUTDOWN');

      await redisConnection.quit();
    }

    if (mongodbConnection) {
      logInfo('MongoDB closed', 'SERVER_SHUTDOWN');

      await mongodbConnection.connection.close(false);
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

process.on('unhandledRejection', (error: unknown) => {
  logError('unhandledRejection', error, 'SERVER');

  shutdown('unhandledRejection').finally(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error: unknown) => {
  logError('uncaughtException', error, 'SERVER');

  shutdown('uncaughtException').finally(() => {
    process.exit(1);
  });
});
