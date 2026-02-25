import type { PostPublic, PostStored } from '@common/types/post.type';

export class PostDTO {
  public static map(data: PostStored): Readonly<PostPublic> {
    return {
      id: data._id.toString(),
      user: data.user.toString(),
      content: data.content,
      mediaUrls: data.mediaUrls,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as const;
  }
}
