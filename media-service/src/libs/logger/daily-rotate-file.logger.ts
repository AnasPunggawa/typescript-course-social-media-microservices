import { join } from 'node:path';
import { format as winstonFormat } from 'winston';
import DailyRotateFile, {
  type DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';

import { LOGS_DIR } from '@configs/paths.config';

function dailyRotateFileTransportBuilder({
  filename,
  level = 'debug',
  maxSize = '20m',
  maxFiles = '1d',
  handleRejections = false,
  handleExceptions = false,
}: DailyRotateFileTransportOptions): DailyRotateFile {
  return new DailyRotateFile({
    level,
    filename: join(LOGS_DIR, `${filename}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize,
    maxFiles,
    format: winstonFormat.json(),
    handleRejections,
    handleExceptions,
  });
}

export const appTransport: DailyRotateFile = dailyRotateFileTransportBuilder({
  filename: 'app',
  level: 'info',
});

export const combinedTransport: DailyRotateFile =
  dailyRotateFileTransportBuilder({
    filename: 'combine',
  });

export const errorTransport: DailyRotateFile = dailyRotateFileTransportBuilder({
  filename: 'error',
  level: 'error',
});

export const exceptionTransport: DailyRotateFile =
  dailyRotateFileTransportBuilder({
    filename: 'exception',
    handleRejections: true,
    handleExceptions: true,
  });
