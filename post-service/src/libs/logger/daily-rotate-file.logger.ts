import { join } from 'node:path';
import { format as winstonFormat } from 'winston';
import DailyRotateFile, {
  type DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';

import { LOGS_DIR } from '@configs/paths.config';

function dailyRotateFileTransportBuilder({
  filename,
  level = 'debug',
  maxSize = '20m', // 20 mb
  maxFiles = '1d', // 1 day
  handleExceptions = false,
  handleRejections = false,
}: DailyRotateFileTransportOptions): DailyRotateFile {
  return new DailyRotateFile({
    level,
    filename: join(LOGS_DIR, `${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize,
    maxFiles,
    format: winstonFormat.json(),
    handleExceptions,
    handleRejections,
  });
}

export const appTransport: DailyRotateFile = dailyRotateFileTransportBuilder({
  filename: 'app',
  level: 'info',
});

export const combinedTransport: DailyRotateFile =
  dailyRotateFileTransportBuilder({
    filename: 'combined',
  });

export const errorTransport: DailyRotateFile = dailyRotateFileTransportBuilder({
  filename: 'error',
  level: 'error',
});

export const exceptionTransport: DailyRotateFile =
  dailyRotateFileTransportBuilder({
    filename: 'exception',
    handleExceptions: true,
    handleRejections: true,
  });
