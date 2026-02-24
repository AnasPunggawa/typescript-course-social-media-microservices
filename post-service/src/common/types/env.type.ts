import z from 'zod';

import { envSchema } from '@common/validations/env.schema';

export type EnvConfig = z.infer<typeof envSchema>;

export type NodeEnv = EnvConfig['NODE_ENV'];
