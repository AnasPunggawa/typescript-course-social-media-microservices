import { DATA_SIZES, SORT } from '@common/constants/pagination.constant';
import { PostSchema } from '@common/validations/post.schema';
import z from 'zod';

export type DataSize = (typeof DATA_SIZES)[keyof typeof DATA_SIZES];

export type Sort = (typeof SORT)[keyof typeof SORT];

export type PaginationQueryRequest = {
  page?: string;
  size?: string;
  sort?: string;
};

export type PaginationQuery = z.infer<typeof PostSchema.paginationQuery>;

export type PaginationResponse = PaginationQuery & {
  totalPage: number;
};
