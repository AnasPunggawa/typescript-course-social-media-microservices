import { getLogger } from './logger';

export function logError(
  message: string,
  error: unknown,
  label: string = 'HTTP',
): void {
  try {
    const logger = getLogger();

    if (error instanceof Error) {
      logger.error(message, {
        label,
        stack: error.stack,
      });
    } else {
      logger.error(message, {
        label,
        stack: error,
      });
    }
  } catch (error: unknown) {
    console.error(
      `[${new Date().toISOString()}] [POST_SERVICE] [${label}] [SAFE_LOG_ERROR] [ERROR]: ${message}\n`,
      error,
    );
  }
}
