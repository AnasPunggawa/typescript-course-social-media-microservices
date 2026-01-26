import { logger } from './logger';

export function logInfo(message: string, label: string = 'HTTP') {
  logger.info(message, { label });
}
