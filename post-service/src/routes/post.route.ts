import { Router } from 'express';

import { PostController } from '@controllers/post.controller';
import { redisRateLimiterMiddleware } from '@middlewares/redis-rate-limiter.middleware';

export const postRouter = Router({ mergeParams: true });

postRouter.post(
  '/',
  redisRateLimiterMiddleware('create'),
  PostController.postPost,
);

postRouter.get(
  '/',
  redisRateLimiterMiddleware('get-posts'),
  PostController.getPosts,
);

postRouter.get(
  '/:postId',
  redisRateLimiterMiddleware('get-post'),
  PostController.getPost,
);
