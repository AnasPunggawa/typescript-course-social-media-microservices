import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  SERVER_HOST: z.string().min(1).default('localhost'),
  SERVER_PORT: z.coerce.number().int().positive().default(3002),

  MONGO_URI: z.url(),

  REDIS_HOST: z.string().min(1).default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
});
