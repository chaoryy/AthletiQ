import Router from 'koa-router';
import Joi from 'joi';
import { getKnex } from '../utils/knex.js';
import bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

export const router = new Router()

router.get('/users', async (ctx) => {
    const knex = await getKnex();
    const users = await knex('users');
  
    ctx.body = { users };
    ctx.status = 200;

  });