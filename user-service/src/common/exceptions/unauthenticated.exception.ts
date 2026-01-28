import { ClientException } from './client.exception';

export class UnauthenticatedException extends ClientException {
  constructor(message: string = 'Unauthenticated') {
    super(message, 401);
  }
}
