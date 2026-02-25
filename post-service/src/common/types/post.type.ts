import { PostSchema } from '@common/validations/post.schema';
import { Types } from 'mongoose';
import z from 'zod';

export type PostCreate = z.infer<typeof PostSchema.create>;

export type PostStored = PostCreate & {
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PostPublic = Omit<PostStored, '_id' | '__v' | 'user'> & {
  id: string;
  user: string;
};

export type PostCreateRequest = Omit<PostCreate, 'user'>;
