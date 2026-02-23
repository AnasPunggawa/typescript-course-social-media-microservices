import { Router } from 'express';

import { AuthController } from '@controllers/auth.controller';
import { userRateLimiterMiddleware } from '@middlewares/redis-rate-limiter.middleware';

export const authRouter = Router({
  mergeParams: true,
});

authRouter.post(
  '/register',
  userRateLimiterMiddleware('register'),
  AuthController.postRegister,
);

authRouter.post(
  '/login',
  userRateLimiterMiddleware('login'),
  AuthController.postLogin,
);

authRouter.get(
  '/refresh',
  userRateLimiterMiddleware('refresh'),
  AuthController.getRefreshAccessToken,
);

authRouter.delete(
  '/logout',
  userRateLimiterMiddleware('logout'),
  AuthController.deleteLogout,
);
