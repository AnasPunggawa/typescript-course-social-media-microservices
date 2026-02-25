import { PostDTO } from '@common/dto/post.dto';
import type { PostCreateRequest, PostPublic } from '@common/types/post.type';
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
}
