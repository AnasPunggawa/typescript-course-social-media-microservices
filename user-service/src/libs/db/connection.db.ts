import { connect } from 'mongoose';

import { MONGO_URI } from '@configs/env.config';
import { logInfo } from '@libs/logger/info.logger';

export async function connection() {
  logInfo('Connecting to database...', 'MONGOOSE');

  const mongodb = await connect(MONGO_URI);

  logInfo('Database connected', 'MONGOOSE');

  return mongodb;
}
