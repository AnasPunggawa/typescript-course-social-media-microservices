import { getLogger } from './logger';

export function logInfo(message: string, label: string = 'HTTP'): void {
  try {
    getLogger().info(message, { label });
  } catch (error: unknown) {
    console.log(
      `[${new Date().toISOString()}] [MEDIA_SERVICE] [${label}] [SAFE_LOG] [INFO]: ${message}`,
    );
  }
}
