import { ClientException } from './client.exception';

export class NotFoundException extends ClientException {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}
