import { PostDTO } from '@common/dto/post.dto';
import { PaginationQueryRequest } from '@common/types/pagination.type';
import type {
  PostCreateRequest,
  PostPublic,
  PostsResponse,
} from '@common/types/post.type';
import { PostSchema } from '@common/validations/post.schema';
import { PostRepository } from '@repositories/post.repository';

export class PostService {
  public static async create(
    userId: unknown,
    createRequest: PostCreateRequest,
  ): Promise<PostPublic> {
    const postCreate = PostSchema.create.parse({
      user: userId,
      ...createRequest,
    });

    const post = await PostRepository.store(postCreate);

    return PostDTO.map(post);
  }

  public static async getPosts(
    queryRequest: PaginationQueryRequest,
  ): Promise<PostsResponse> {
    const { page, ...query } = PostSchema.paginationQuery.parse(queryRequest);

    const skip = (page - 1) * query.size;

    const posts = await PostRepository.selectPosts({ ...query, skip });

    const totalPosts = await PostRepository.countPosts();

    return {
      posts: posts.map((post) => PostDTO.map(post)),
      pagination: {
        ...query,
        page,
        totalPage: Math.ceil(totalPosts / query.size),
      },
    };
  }
}
