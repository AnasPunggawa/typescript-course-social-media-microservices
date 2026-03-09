import { connect, type Mongoose } from 'mongoose';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';

export async function initMongoDB(URI: string): Promise<Mongoose> {
  try {
    logInfo('Connecting to MongoDB...', 'MONGODB');

    const mongodbConnection = await connect(URI);

    logInfo('MongoDB connected', 'MONGODB');

    return mongodbConnection;
  } catch (error: unknown) {
    logError('MongoDB connection failed', error, 'MONGODB');

    throw error;
  }
}
