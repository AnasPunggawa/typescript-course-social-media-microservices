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
import { RedisPostCache } from '@libs/caches/redis-post.cache';
import { getRedis } from '@libs/db/redis.db';
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

    const mappedPost = PostDTO.map(post);

    const redisClient = getRedis();

    await Promise.all([
      redisClient.incr(RedisPostCache.REDIS_KEY_VERSION),
      redisClient.set(
        RedisPostCache.buildItemKey(post._id.toString()),
        JSON.stringify(mappedPost),
        'EX',
        60 * 10, // TTL 10 minutes
      ),
    ]);

    return mappedPost;
  }

  public static async getPosts(
    queryRequest: PaginationQueryRequest & PostFilterRequest,
  ): Promise<PostsResponse> {
    const { page, user, ...query } =
      PostSchema.paginationQuery.parse(queryRequest);

    const redisClient = getRedis();

    const version = await RedisPostCache.getListVersion();

    const cachedKey = RedisPostCache.buildListKey({
      page,
      user,
      version,
      ...query,
    });

    const cachedValue = await redisClient.get(cachedKey);

    if (cachedValue) {
      return JSON.parse(cachedValue) as PostsResponse;
    }

    const filter: PostFilter = {};

    if (user) {
      filter.user = user;
    }

    const skip = (page - 1) * query.size;

    const [posts, totalPosts] = await Promise.all([
      PostRepository.selectPosts({ ...query, skip }, filter),
      PostRepository.countPosts(filter),
    ]);

    const mappedPosts = {
      posts: posts.map((post) => PostDTO.map(post)),
      pagination: {
        ...query,
        page,
        totalPage: Math.ceil(totalPosts / query.size),
      },
    };

    await redisClient.set(
      cachedKey,
      JSON.stringify(mappedPosts),
      'EX',
      60 * 15,
    ); // TTL 15 minutes

    return mappedPosts;
  }

  public static async getPost(id: string): Promise<PostPublic> {
    const postId = PostSchema.id.parse(id);

    const redisClient = getRedis();

    const cachedKey = RedisPostCache.buildItemKey(postId.toString());

    const cachedValue = await redisClient.get(cachedKey);

    if (cachedValue) {
      return JSON.parse(cachedValue) as PostPublic;
    }

    const post = await PostRepository.selectPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const mappedPost = PostDTO.map(post);

    await redisClient.set(cachedKey, JSON.stringify(mappedPost), 'EX', 60 * 10); // TTL 10 minutes

    return mappedPost;
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

    const mappedPost = PostDTO.map(post);

    const redisClient = getRedis();

    await Promise.all([
      redisClient.incr(RedisPostCache.REDIS_KEY_VERSION),
      redisClient.set(
        RedisPostCache.buildItemKey(id.toString()),
        JSON.stringify(mappedPost),
        'EX',
        60 * 10, // TTL 10 minutes
      ),
    ]);

    return mappedPost;
  }

  public static async delete(postId: string, userId: string): Promise<void> {
    const { id, user } = PostSchema.delete.parse({ id: postId, user: userId });

    const post = await PostRepository.deletePostByIdAndUser(id, user);

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }

    const redisClient = getRedis();

    await Promise.all([
      redisClient.incr(RedisPostCache.REDIS_KEY_VERSION),
      redisClient.del(RedisPostCache.buildItemKey(id.toString())),
    ]);
  }
}
