import { PostDTO } from '@common/dto/post.dto';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { PaginationQueryRequest } from '@common/types/pagination.type';
import type {
  PostCreateRequest,
  PostFilter,
  PostFilterRequest,
  PostPatchRequest,
  PostPublic,
  PostsResponse,
} from '@common/types/post.type';
import { PostSchema } from '@common/validations/post.schema';
import { PostRepository } from '@repositories/post.repository';

export class PostService {
  public static async create(
    userId: string,
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
    queryRequest: PaginationQueryRequest & PostFilterRequest,
  ): Promise<PostsResponse> {
    const { page, user, ...query } =
      PostSchema.paginationQuery.parse(queryRequest);

    const filter: PostFilter = {};

    if (user) {
      filter.user = user;
    }

    const skip = (page - 1) * query.size;

    const [posts, totalPosts] = await Promise.all([
      PostRepository.selectPosts({ ...query, skip }, filter),
      PostRepository.countPosts(filter),
    ]);

    return {
      posts: posts.map((post) => PostDTO.map(post)),
      pagination: {
        ...query,
        page,
        totalPage: Math.ceil(totalPosts / query.size),
      },
    };
  }

  public static async getPost(id: string): Promise<PostPublic> {
    const postId = PostSchema.id.parse(id);

    const post = await PostRepository.selectPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostDTO.map(post);
  }

  public static async patch(
    postId: string,
    userId: string,
    patchRequest: PostPatchRequest,
  ): Promise<PostPublic> {
    const { id, ...data } = PostSchema.patch.parse({
      id: postId,
      user: userId,
      ...patchRequest,
    });

    const post = await PostRepository.patchPostByIdAndUser(id, data);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostDTO.map(post);
  }

  public static async delete(postId: string, userId: string): Promise<void> {
    const { id, user } = PostSchema.delete.parse({ id: postId, user: userId });

    const post = await PostRepository.deletePostByIdAndUser(id, user);

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
  }
}
