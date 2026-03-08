import { ensureDirectory } from '@common/utils/ensure-directory.util';
import { logInfo } from '@libs/logger/info.logger';
import { LOGS_DIR } from './paths.config';

export async function setupRuntimeDirectories(): Promise<void> {
  logInfo('Runtime directories initialized', 'SERVER');

  await ensureDirectory(LOGS_DIR);
}
