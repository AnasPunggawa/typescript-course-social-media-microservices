import { PostDTO } from '@common/dto/post.dto';
import { NotFoundException } from '@common/exceptions/not-found.exception';
import { PaginationQueryRequest } from '@common/types/pagination.type';
import type {
  PostCreateRequest,
  PostPatchRequest,
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
    userId: unknown,
    patchRequest: PostPatchRequest,
  ): Promise<PostPublic> {
    const { id, ...data } = PostSchema.patch.parse({
      id: postId,
      user: userId,
      ...patchRequest,
    });

    console.log(id, data);

    const post = await PostRepository.patchPostByIdAndUser(id, data);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostDTO.map(post);
  }
}
