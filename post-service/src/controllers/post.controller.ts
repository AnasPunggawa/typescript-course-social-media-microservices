import type { NextFunction, Request, Response } from 'express';

import { PostCreateRequest } from '@common/types/post.type';
import { responseSuccess } from '@libs/responses/success.response';
import { PostService } from '@services/post.service';

export class PostController {
  public static async postPost(
    req: Request<{}, PostCreateRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const post = await PostService.create(req.get('X-User-Id'), req.body);

      responseSuccess({
        res,
        statusCode: 200,
        message: 'Post Created',
        data: { post },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async getPosts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const posts = await PostService.getPosts(req.query);

      responseSuccess({
        res,
        statusCode: 200,
        message: 'Fetch All Posts',
        data: { posts },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async getPost(
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const post = await PostService.getPost(req.params.postId);

      responseSuccess({
        res,
        statusCode: 200,
        message: 'Fetch single post',
        data: { post },
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
