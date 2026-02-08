import { getLogger } from './logger';

export function logInfo(message: string, label: string = 'HTTP') {
  try {
    const logger = getLogger();

    logger.info(message, { label });
  } catch {
    console.error(
      `[${new Date().toISOString()}] [API-GATEWAY] [${label}] [SAFE_LOG_INFO] [INFO]: ${message}`,
    );
  }
}
