import { Router } from 'express';
import { UserController } from '../controllers';

export const userRouter = Router({
  mergeParams: true,
});

userRouter.post('/register', UserController.postRegister);

userRouter.post('/login', UserController.postLogin);

userRouter.get('/refresh', UserController.getRefreshAccessToken);

userRouter.delete('/logout', UserController.deleteLogout);

userRouter.get('/', UserController.getUsers);
