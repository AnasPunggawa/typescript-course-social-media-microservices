import { getLogger } from './logger';

export function logInfo(message: string, label: string = 'HTTP') {
  try {
    const logger = getLogger();

    logger.info(message, { label });
  } catch (error: unknown) {
    console.log(
      `[${new Date().toISOString()}] [POST_SERVICE] [${label}] [SAFE_LOG_INFO] [INFO]: ${message}`,
    );
  }
}
