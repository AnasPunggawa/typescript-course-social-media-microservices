import { Router } from 'express';
import { UserController } from '../controllers';

export const userRouter = Router({
  mergeParams: true,
});

userRouter.post('/', UserController.post);

userRouter.get('/', UserController.getUsers);
