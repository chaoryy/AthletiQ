import Router from 'koa-router';
import { getUserById } from '../services/users.js';
import { getKnex } from '../utils/knex.js';

export const userRouter = new Router();

userRouter.post('/users/:id', async (ctx) => {
  const user = await getUserById(ctx.params.id);

  ctx.body = {
    user,
  };
  ctx.status = 200;
});

userRouter.post('/users', async (ctx) => {
  const knex = await getKnex();
  const users = await knex('users');

  ctx.body = { users };
  ctx.status = 200;
})
