import { PostSchema } from '@common/validations/post.schema';
import { Types } from 'mongoose';
import z from 'zod';
import type { PaginationQuery, PaginationResponse } from './pagination.type';

export type PostCreate = z.infer<typeof PostSchema.create>;

export type PostStored = PostCreate & {
  _id: Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PostFilter = Partial<Pick<PostStored, 'user' | 'content'>>;

export type PostFilterRequest = {
  user?: string | undefined;
  content?: string | undefined;
};

export type PostPublic = Omit<PostStored, '_id' | '__v' | 'user'> & {
  id: string;
  user: string;
};

export type PostCreateRequest = Omit<PostCreate, 'user'>;

export type QueryPosts = Omit<PaginationQuery, 'page'> & {
  skip: number;
};

export type PostsResponse = {
  posts: PostPublic[];
  pagination: PaginationResponse;
};

export type PostPatch = z.infer<typeof PostSchema.patch>;

export type PostPatchRequest = Omit<PostPatch, 'id' | 'user'>;
