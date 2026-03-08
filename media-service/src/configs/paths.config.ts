import { join } from 'node:path';
import { cwd } from 'node:process';

export const ROOT = cwd();

export const LOGS_DIR = join(ROOT, 'logs');
