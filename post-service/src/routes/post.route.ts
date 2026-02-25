import { Router } from 'express';

import { PostController } from '@controllers/post.controller';

export const postRouter = Router({ mergeParams: true });

postRouter.post('/', PostController.postPost);
