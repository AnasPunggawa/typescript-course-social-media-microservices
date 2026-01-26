import 'dotenv/config';
import { env } from 'node:process';

export const NODE_ENV = env['NODE_ENV'] ?? 'development';

export const HOST = env['HOST'] ?? 'localhost';

const PORT_RAW = Number(env['PORT']);
export const PORT = Number.isInteger(PORT_RAW) ? PORT_RAW : 3001;

export const MONGO_URI = env['MONGO_URI'];

export const JWT_ACCESS_SECRET = env['JWT_ACCESS_SECRET'];

export const JWT_REFRESH_SECRET = env['JWT_REFRESH_SECRET'];
