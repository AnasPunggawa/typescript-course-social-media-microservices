import { Types } from 'mongoose';
import z from 'zod';
import type { UserSchema } from '../validations';

export type UserRegisterRequest = z.infer<typeof UserSchema.register>;

export type UserRegister = UserRegisterRequest;

export type UserLoginRequest = z.infer<typeof UserSchema.login>;

export type UserLogin = UserLoginRequest;

export type UserStored = UserRegister & {
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPublic = Omit<UserStored, '_id' | '__v' | 'password'> & {
  id: string;
};

export type UserResponse = UserPublic;
