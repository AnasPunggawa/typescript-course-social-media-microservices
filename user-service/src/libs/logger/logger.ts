import { createLogger, format, transports } from 'winston';

import { NODE_ENV } from '@configs/env.config';
import {
  appTransport,
  combinedTransport,
  errorTransport,
  exceptionTransport,
} from './daily-rotate-file.logger';
import { customLoggerFormat } from './format';

const { combine, errors, timestamp, ms, metadata, splat } = format;

export const logger = createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'user-service' },
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
