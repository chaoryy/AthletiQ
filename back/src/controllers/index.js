import Router from 'koa-router';
import Joi from 'joi';
import { getKnex } from '../utils/knex.js';
import bcrypt from 'bcrypt';

export const router = new Router()

router.get('/users', async (ctx) => {
    const knex = await getKnex();
    const users = await knex('users');
  
    ctx.body = { users };
    ctx.status = 200;

  });

router.post('/register', async(ctx) => {
  const joiSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const {name, email, password} = await joiSchema.validateAsync(ctx.request.body);

  const passwordHash = await bcrypt.hash(password, 12);

  const knex = await getKnex();

  const dbUser = await knex('users').insert({
    name,
    email,
    password: passwordHash,
  }).returning('*');

  ctx.body = { dbUser };
  ctx.status = 201;
});

router.post('/login', async (ctx) => {

  const joiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { email, password } = await joiSchema.validateAsync(ctx.request.body);

  const knex = await getKnex();
  
  const dbUSer = await knex('users').where({ email }).first();

  if(!dbUSer){
    throw new Error('USER NOT FOUND');
  }

  const matchPassword = await bcrypt.compare(password, dbUSer.password);

  if(!matchPassword){
    ctx.status = 400;
    throw new Error('email or password is incorrect!');

    return;
  }

    ctx.status = 200;
    ctx.body = { ok : true };

} )