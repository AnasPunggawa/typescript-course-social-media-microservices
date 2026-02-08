import { createLogger, format, Logger, transports } from 'winston';

import {
  appTransport,
  combinedTransport,
  errorTransport,
  exceptionTransport,
} from './daily-rotate-file.logger';
import { customLoggerFormat } from './format';

let logger: Logger | undefined;

export function initLogger(nodeEnv: string): Logger {
  if (logger) {
    return logger;
  }

  const { combine, errors, timestamp, ms, metadata, splat } = format;

  logger = createLogger({
    level: nodeEnv === 'production' ? 'info' : 'debug',
    defaultMeta: { service: 'API-GATEWAY' },
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
      customLoggerFormat,
    ),
    transports: [
      new transports.Console(),
      errorTransport,
      appTransport,
      combinedTransport,
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
