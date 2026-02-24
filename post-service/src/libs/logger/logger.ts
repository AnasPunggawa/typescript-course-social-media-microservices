import { createLogger, format, type Logger, transports } from 'winston';

import { NodeEnv } from '@common/types/env.type';
import {
  appTransport,
  combinedTransport,
  errorTransport,
  exceptionTransport,
} from './daily-rotate-file.logger';
import { customFormatLogger } from './format';

let logger: Logger | undefined;

export function initLogger(NODE_ENV: NodeEnv): Logger {
  const { combine, errors, metadata, ms, splat, timestamp } = format;

  logger = createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    defaultMeta: { service: 'POST_SERVICE' },
    format: combine(
      splat(),
      timestamp(),
      ms(),
      errors({ stack: true }),
      metadata({
        fillExcept: [
          'message',
          'level',
          'timestamp',
          'service',
          'label',
          'ms',
          'stack',
        ],
      }),
      customFormatLogger,
    ),
    transports: [
      new transports.Console(),
      appTransport,
      combinedTransport,
      errorTransport,
    ],

    exceptionHandlers: [exceptionTransport],
    rejectionHandlers: [exceptionTransport],

    exitOnError: true,
  });

  return logger;
}

export function getLogger(): Logger {
  if (!logger) {
    throw new Error('Logger not initialized');
  }

  return logger;
}
