import { Types } from 'mongoose';

export type RefreshTokenStored = {
  _id: Types.ObjectId;
  __v: number;
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type RefreshTokenStore = Pick<
  RefreshTokenStored,
  'token' | 'user' | 'expiresAt'
>;

export type TokenPayloadSign = {
  sub: string;
};

export type AccessTokenPayloadSign = TokenPayloadSign;

export type RefreshTokenPayloadSign = TokenPayloadSign;

export type TokenAndUserId = Pick<RefreshTokenStored, 'token' | 'user'>;

export type RefreshTokenPublic = Omit<RefreshTokenStored, '__v'>;

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenType = 'ACCESS' | 'REFRESH';

export type TokenConfig = {
  secret: string;
  defaultExpiresIn: number;
};
