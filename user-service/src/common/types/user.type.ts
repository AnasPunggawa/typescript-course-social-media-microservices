import { Types } from 'mongoose';
import z from 'zod';
import type { UserSchema } from '../validations';

export type UserCreateRequest = z.infer<typeof UserSchema.create>;

export type UserCreate = UserCreateRequest;

export type UserStored = UserCreate & {
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPublic = Omit<UserStored, '_id' | '__v' | 'password'> & {
  id: string;
};

export type UserResponse = UserPublic;
