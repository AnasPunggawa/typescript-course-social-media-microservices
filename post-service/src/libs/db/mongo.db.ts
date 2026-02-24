import { logError } from '@libs/logger/error.log';
import { logInfo } from '@libs/logger/info.logger';
import { connect, type Mongoose } from 'mongoose';

export async function initMongoDB(URI: string): Promise<Mongoose> {
  try {
    logInfo('Connecting to MongoDB', 'MONGODB');

    const mongodbConnection = await connect(URI);

    logInfo('MongoDB connected', 'MONGODB');

    return mongodbConnection;
  } catch (error: unknown) {
    logError('MongoDB connection failed', error, 'MONGODB');

    throw error;
  }
}
