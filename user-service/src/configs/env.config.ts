import { Env } from '@common/utils/env.util';

export const NODE_ENV = Env.optionalString('NODE_ENV', 'development');

export const SERVER_HOST = Env.optionalString('SERVER_HOST', 'localhost');

export const SERVER_PORT = Env.optionalNumber('SERVER_PORT', 3001);

export const MONGO_URI = Env.required('MONGO_URI');

export const JWT_ACCESS_SECRET = Env.required('JWT_ACCESS_SECRET');

export const JWT_REFRESH_SECRET = Env.required('JWT_ACCESS_SECRET');

export const COOKIE_SECRET = Env.required('COOKIE_SECRET');

export const ALLOWED_ORIGINS = Env.required('ALLOWED_ORIGINS');

export const REDIS_HOST = Env.required('REDIS_HOST');

export const REDIS_PORT = Env.requiredNumber('REDIS_PORT');
