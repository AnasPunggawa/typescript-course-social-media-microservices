import { envSchema } from '@common/validations/env.schema';
import z from 'zod';

export type EnvConfig = z.infer<typeof envSchema>;

export type NodeEnv = EnvConfig['NODE_ENV'];
