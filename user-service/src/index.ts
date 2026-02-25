import 'dotenv/config';
import type Redis from 'ioredis';
import type { Mongoose } from 'mongoose';
import type { Server } from 'node:http';
import process from 'node:process';

import { loadEnv } from '@configs/env.config';
import { setupRuntimeDirectories } from '@configs/runtime.config';
import { JWTManager } from '@infrastructures/security';
import { connection } from '@libs/db/connection.db';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { initLogger } from '@libs/logger/logger';
import { startServer } from './server';

let isShuttingDown: boolean = false;
let server: Server | undefined;
let mongooseConnection: Mongoose | undefined;
let redisConnection: Redis | undefined;

async function bootstrap(): Promise<void> {
  const env = loadEnv();

  await setupRuntimeDirectories();

  initLogger(env.NODE_ENV);

  const connections = await connection();

  mongooseConnection = connections.mongooseConnection;
  redisConnection = connections.redisConnection;

  server = startServer(env.SERVER_PORT, env.SERVER_HOST);

  JWTManager.init(env);
}

bootstrap().catch((err: unknown) => {
  logError('User Service Error', err, 'BOOTSTRAP');

  process.exit(1);
});

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;

  logInfo(`Received ${signal}`, 'SERVER_SHUTDOWN');

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

          logInfo('HTTP server closed', 'SERVER_SHUTDOWN');

          resolve();
        });
      });
    }

    if (redisConnection) {
      await redisConnection.quit();

      logInfo('Redis closed', 'SERVER_SHUTDOWN');
    }

    if (mongooseConnection) {
      await mongooseConnection.connection.close(false);

      logInfo('MongoDB closed', 'SERVER_SHUTDOWN');
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

process.on('uncaughtException', async (error) => {
  logError('uncaughtException', error, 'SERVER');

  shutdown('uncaughtException').finally(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', async (error) => {
  logError('unhandledRejection', error, 'SERVER');

  shutdown('unhandledRejection').finally(() => {
    process.exit(1);
  });
});
