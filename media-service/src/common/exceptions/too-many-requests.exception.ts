import { ClientException } from './client.exception';

export class TooManyRequestsExceptions extends ClientException {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429);
  }
}
