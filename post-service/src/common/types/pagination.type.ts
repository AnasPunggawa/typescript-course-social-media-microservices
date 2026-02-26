import { DATA_SIZES, SORT_BY } from '@common/constants/pagination.constant';
import { PostSchema } from '@common/validations/post.schema';
import z from 'zod';

export type DataSize = (typeof DATA_SIZES)[keyof typeof DATA_SIZES];

export type SortBy = (typeof SORT_BY)[keyof typeof SORT_BY];

export type PaginationQueryRequest = {
  page?: string;
  size?: string;
  sort?: string;
};

export type PaginationQuery = z.infer<typeof PostSchema.paginationQuery>;

export type PaginationResponse = PaginationQuery & {
  totalPage: number;
};
