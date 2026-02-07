import { Router } from 'express';

import { UserController } from '@controllers/user.controller';
import { userRateLimiterMiddleware } from '@middlewares/redis-rate-limiter.middleware';

export const userRouter = Router({
  mergeParams: true,
});

userRouter.get('/', userRateLimiterMiddleware('auth'), UserController.getUsers);

userRouter.post(
  '/register',
  userRateLimiterMiddleware('register'),
  UserController.postRegister,
);

userRouter.post(
  '/login',
  userRateLimiterMiddleware('login'),
  UserController.postLogin,
);

userRouter.get(
  '/refresh',
  userRateLimiterMiddleware('refresh'),
  UserController.getRefreshAccessToken,
);

userRouter.delete(
  '/logout',
  userRateLimiterMiddleware('logout'),
  UserController.deleteLogout,
);
