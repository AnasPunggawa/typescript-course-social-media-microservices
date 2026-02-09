import { env } from 'node:process';

import type { EnvConfig } from '@common/types/env.type';
import { envSchema } from '@common/validations/env.schema';

let cachedEnv: EnvConfig | undefined;

export function loadEnv(): EnvConfig {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse(env);

    return cachedEnv;
  } catch (error: unknown) {
    throw error;
  }
}
