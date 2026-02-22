import { Router } from 'express';

import { UserController } from '@controllers/user.controller';
import { userRateLimiterMiddleware } from '@middlewares/redis-rate-limiter.middleware';

export const userRouter = Router({
  mergeParams: true,
});

userRouter.get('/', userRateLimiterMiddleware('auth'), UserController.getUsers);

userRouter.get(
  '/current',
  userRateLimiterMiddleware('auth'),
  UserController.getCurrent,
);
