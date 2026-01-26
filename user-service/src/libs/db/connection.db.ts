import { connect } from 'mongoose';
import { MONGO_URI } from '../../configs';
import { logInfo } from '../logger';

export async function connection() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is undefined, please check the .env file');
  }

  logInfo('Connecting to database...', 'MONGOOSE');

  const mongodb = await connect(MONGO_URI);

  logInfo('Database connected', 'MONGOOSE');

  return mongodb;
}
