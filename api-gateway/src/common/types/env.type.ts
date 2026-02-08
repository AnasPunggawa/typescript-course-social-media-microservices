import z from 'zod';
import { envSchema } from '../validations/env.schema';

export type EnvConfig = z.infer<typeof envSchema>;
