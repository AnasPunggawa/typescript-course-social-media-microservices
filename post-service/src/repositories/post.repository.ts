import type {
  PostCreate,
  PostStored,
  QueryPosts,
} from '@common/types/post.type';
import { Post } from '@models/post.model';
import { Types } from 'mongoose';

export class PostRepository {
  public static async store(data: PostCreate): Promise<PostStored> {
    return Post.create(data);
  }

  public static async selectPosts(query: QueryPosts): Promise<PostStored[]> {
    return Post.find({})
      .select({ __v: 0 })
      .sort({ createdAt: query.sortBy === 'asc' ? 1 : -1 })
      .limit(query.size)
      .skip(query.skip)
      .lean();
  }

  public static countPosts(): Promise<number> {
    return Post.countDocuments();
  }

  public static selectPostById(id: Types.ObjectId): Promise<PostStored | null> {
    return Post.findById(id).select({ __v: 0 }).lean();
  }
}
