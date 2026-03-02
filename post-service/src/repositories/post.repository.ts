import type {
  PostCreate,
  PostFilter,
  PostPatch,
  PostStored,
  QueryPosts,
} from '@common/types/post.type';
import { Post } from '@models/post.model';
import { Types } from 'mongoose';

export class PostRepository {
  public static async store(data: PostCreate): Promise<PostStored> {
    return Post.create(data);
  }

  public static async selectPosts(
    query: QueryPosts,
    filter: PostFilter = {},
  ): Promise<PostStored[]> {
    return Post.find(filter)
      .select({ __v: 0 })
      .sort({ createdAt: query.sort === 'newest' ? -1 : 1 })
      .skip(query.skip)
      .limit(query.size)
      .lean();
  }

  public static countPosts(filter: PostFilter = {}): Promise<number> {
    return Post.countDocuments(filter);
  }

  public static selectPostById(id: Types.ObjectId): Promise<PostStored | null> {
    return Post.findById(id).select({ __v: 0 }).lean();
  }

  public static patchPostByIdAndUser(
    id: Types.ObjectId,
    data: Omit<PostPatch, 'id'>,
  ): Promise<PostStored | null> {
    const { user, ...patch } = data;

    return Post.findOneAndUpdate({ _id: id, user }, patch, {
      returnDocument: 'after',
    })
      .select({ __v: 0 })
      .lean();
  }

  public static async deletePostByIdAndUser(
    id: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<PostStored | null> {
    return Post.findOneAndDelete({ _id: id, user }).select({ __v: 0 }).lean();
  }
}
