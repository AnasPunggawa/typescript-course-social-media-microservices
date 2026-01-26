import { mkdir } from 'node:fs/promises';

export async function ensureDirectory(dirPath: string): Promise<void> {
  await mkdir(dirPath, {
    recursive: true,
  });
}
