import { Router } from 'express';

import { UserController } from '@controllers/user.controller';
import { userRateLimiterMiddleware } from '@middlewares/redis-rate-limiter.middleware';

export const authRouter = Router({
  mergeParams: true,
});

authRouter.post(
  '/register',
  userRateLimiterMiddleware('register'),
  UserController.postRegister,
);

authRouter.post(
  '/login',
  userRateLimiterMiddleware('login'),
  UserController.postLogin,
);

authRouter.get(
  '/refresh',
  userRateLimiterMiddleware('refresh'),
  UserController.getRefreshAccessToken,
);

authRouter.delete(
  '/logout',
  userRateLimiterMiddleware('logout'),
  UserController.deleteLogout,
);
