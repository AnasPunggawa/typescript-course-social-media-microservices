import 'dotenv/config';
import type Redis from 'ioredis';
import type { Mongoose } from 'mongoose';
import type { Server } from 'node:http';
import process from 'node:process';

import { SERVER_HOST, SERVER_PORT } from '@configs/env.config';
import { setupRuntimeDirectories } from '@configs/runtime.config';
import { connection } from '@libs/db/connection.db';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { startServer } from './server';

let isShuttingDown: boolean = false;
let server: Server | undefined;
let mongooseConnection: Mongoose | undefined;
let redisConnection: Redis | undefined;

async function bootstrap(): Promise<void> {
  await setupRuntimeDirectories();

  const connections = await connection();

  mongooseConnection = connections.mongooseConnection;
  redisConnection = connections.redisConnection;

  server = startServer(SERVER_PORT, SERVER_HOST);
}

bootstrap().catch((err: unknown) => {
  logError('App Error', err, 'SERVER');

  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  logInfo(`Received ${signal}`, 'SERVER');

  if (!server && !mongooseConnection && !redisConnection) {
    process.exitCode = 0;

    return;
  }

  const forceExitTimer = setTimeout(() => {
    process.exit(process.exitCode ?? 1);
  }, 1000 * 10); // 10 seconds

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((err) => {
          if (err) {
            return reject(err);
          }

          logInfo('HTTP server closed', 'SERVER');

          resolve();
        });
      });
    }

    if (redisConnection) {
      await redisConnection.quit();

      logInfo('Redis closed', 'REDIS');
    }

    if (mongooseConnection) {
      await mongooseConnection.connection.close(false);

      logInfo('MongoDB closed', 'MONGOOSE');
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

process.on('uncaughtException', async (reason: unknown) => {
  console.error(reason);

  shutdown('uncaughtException').finally(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', async (reason: unknown) => {
  console.error(reason);

  shutdown('unhandledRejection').finally(() => {
    process.exit(1);
  });
});
