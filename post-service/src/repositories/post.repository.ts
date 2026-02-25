import type { PostCreate, PostStored } from '@common/types/post.type';
import { Post } from '@models/post.model';

export class PostRepository {
  public static async store(data: PostCreate): Promise<PostStored> {
    return Post.create(data);
  }
}
