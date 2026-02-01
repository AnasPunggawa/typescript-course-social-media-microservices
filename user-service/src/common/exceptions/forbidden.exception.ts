import { ClientException } from './client.exception';

export class ForbiddenException extends ClientException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
