import { ClientException } from './client.exception';

export class TooManyRequestsException extends ClientException {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429);
  }
}
