import { UnknownResponse } from './response.type';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = UnknownResponse<Tokens, Record<string, unknown>>;
