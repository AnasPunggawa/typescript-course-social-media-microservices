import type { NextFunction, Request, Response } from 'express';

import { PostCreateRequest, PostPatchRequest } from '@common/types/post.type';
import { responseSuccess } from '@libs/responses/success.response';
import { PostService } from '@services/post.service';

export class PostController {
  public static async postPost(
    req: Request<{}, PostCreateRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await PostService.create(req.get('X-User-Id'), req.body);

      responseSuccess({
        res,
        statusCode: 200,
        message: 'Post Created',
        data,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async getPosts(
    req: Request<{}, {}, {}, { user?: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user, ...query } = req.query;

      const resolvedUser =
        user === 'me' ? (req.get('X-User-Id') ?? undefined) : user;

      const posts = await PostService.getPosts({
        ...query,
        user: resolvedUser,
      });

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

  public static async patchPost(
    req: Request<{ postId: string }, PostPatchRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const post = await PostService.patch(
        req.params.postId,
        req.get('X-User-Id'),
        req.body,
      );

      responseSuccess({
        res,
        statusCode: 200,
        message: 'Updated the post',
        data: { post },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public static async deletePost(
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await PostService.delete(req.params.postId, req.get('X-User-Id'));

      responseSuccess({ res, statusCode: 200, message: 'Deleted the post' });
    } catch (error: unknown) {
      next(error);
    }
  }
}
