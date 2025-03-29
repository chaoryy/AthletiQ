import Router from 'koa-router';
import { getUserById } from '../services/users.js';
import { getKnex } from '../utils/knex.js';

export const router = new Router()

router.get('/users', async (ctx) => {
    const knex = await getKnex();
    const users = await knex('users');
  
    ctx.body = { users };
    ctx.status = 200;

    throw new Error("some error");
  });