import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),

  SERVER_HOST: z.string().min(1).default('localhost'),
  SERVER_PORT: z.coerce.number().int().positive().default(3001),

  ALLOWED_ORIGINS: z
    .string()
    .min(1)
    .transform((str) => str.split(',').map((origin) => origin.trim()))
    .superRefine((origins, ctx) => {
      origins.forEach((origin) => {
        const { error } = z.url().safeParse(origin);

        if (error) {
          ctx.addIssue({
            code: 'invalid_format',
            format: 'url',
            message: `Invalid allowed origins URL: ${origin}`,
          });
        }
      });
    })
    .default([]),

  COOKIE_SECRET: z.string().min(32),

  MONGO_URI: z.url(),

  JWT_REFRESH_SECRET: z.string().min(32),

  REDIS_HOST: z.string().min(1).default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
});
