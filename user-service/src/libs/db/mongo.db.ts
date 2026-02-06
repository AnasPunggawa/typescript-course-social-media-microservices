import { connect, Mongoose } from 'mongoose';

import { MONGO_URI } from '@configs/env.config';
import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';

export async function initMongodb(): Promise<Mongoose> {
  try {
    logInfo('Connecting to MongoDB...', 'MONGODB');

    const mongooseConnection = await connect(MONGO_URI);

    logInfo('MongoDB connected', 'MONGODB');

    return mongooseConnection;
  } catch (error: unknown) {
    logError('Redis connection failed', error, 'MONGODB');

    throw error;
  }
}
