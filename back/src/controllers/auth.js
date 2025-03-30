import Router from 'koa-router';
import Joi from 'joi';
import { getKnex } from '../utils/knex.js';
import bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

const authRouter = new Router();

authRouter.post('/register', async(ctx) => {
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
  
  authRouter.post('/login', async (ctx) => {
  
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
      throw new Error('email or password is incorrect!');
    }
  
    const token = crypto.randomBytes(20).toString('hex');
  
    await knex('tokens').insert({
      user_id : dbUSer.id,
      token,
    })
  
    ctx.status = 200;
    ctx.body = { ok : true };
  
  })

  authRouter.post('/logout', async(ctx) => {
    const { authorization } = ctx.request.headers;
  
    if (!authorization) {
        throw new Error('Authorization header is missing');
    }

    const token = authorization.split(' ')[1];
    
    if (!token) {
        throw new Error('Token is missing');
    }

    const knex = await getKnex();
   
    await knex('tokens').where({ token }).del();

    ctx.status = 200;
    ctx.body = { ok: true, message: 'Logged out successfully' };
    })

export { authRouter };