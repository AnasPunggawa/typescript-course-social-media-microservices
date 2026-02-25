import { PostSchema } from '@common/validations/post.schema';
import { Types } from 'mongoose';
import z from 'zod';

export type CreatePost = z.infer<typeof PostSchema.create>;

export type PostStored = CreatePost & {
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PostPublic = Omit<PostStored, '_id' | '__v' | 'user'> & {
  id: string;
  user: string;
};
