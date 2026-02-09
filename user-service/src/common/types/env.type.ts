import z from 'zod';
import { envSchema } from '../validations/env.schema';

export type EnvConfig = z.infer<typeof envSchema>;

export type NodeEnv = EnvConfig['NODE_ENV'];
