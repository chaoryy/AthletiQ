import Router from 'koa-router';
import { getUserById } from '../services/users.js';

export const userRouter = new Router();

userRouter.post('/users/:id', async (ctx) => {
  const user = await getUserById(ctx.params.id);

  ctx.body = {
    user,
  };
  ctx.status = 200;
});
