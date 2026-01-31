import { Env } from '@common/utils/env.util';

export const NODE_ENV = Env.optionalString('NODE_ENV', 'development');

export const HOST = Env.optionalString('HOST', 'localhost');

export const PORT = Env.optionalNumber('PORT', 3001);

export const MONGO_URI = Env.required('MONGO_URI');

export const JWT_ACCESS_SECRET = Env.required('JWT_ACCESS_SECRET');

export const JWT_REFRESH_SECRET = Env.required('JWT_ACCESS_SECRET');

export const COOKIE_SECRET = Env.required('COOKIE_SECRET');
