import { join } from 'node:path';
import { cwd } from 'node:process';

export const ROOT = cwd();

export const LOGS_DIR = join(ROOT, 'logs');

export const JWT_ACCESS_PUBLIC_KEY_FILE = join(ROOT, 'access-public.pem');
