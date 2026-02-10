import { ClientException } from './client.exception';

export class TooManyRequestException extends ClientException {
  constructor(message: string = 'Too Many Requests') {
    super(message, 429);
    this.name = 'TooManyRequestException';
  }
}
