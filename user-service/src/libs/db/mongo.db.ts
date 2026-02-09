import { connect, type Mongoose } from 'mongoose';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';

export async function initMongodb(MONGO_URI: string): Promise<Mongoose> {
  try {
    logInfo('Connecting to MongoDB...', 'MONGODB');

    const mongooseConnection = await connect(MONGO_URI);

    logInfo('MongoDB connected', 'MONGODB');

    return mongooseConnection;
  } catch (error: unknown) {
    logError('MongoDB connection failed', error, 'MONGODB');

    throw error;
  }
}
