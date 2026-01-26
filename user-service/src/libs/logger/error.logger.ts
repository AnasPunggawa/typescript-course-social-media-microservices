import { logger } from './logger';

export function logError(
  message: string,
  error: unknown,
  label: string = 'HTTP',
) {
  if (error instanceof Error) {
    logger.error(message, {
      label,
      stack: error.stack,
    });
  } else {
    logger.error(message, {
      label,
      error,
    });
  }
}
