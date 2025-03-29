import Router from 'koa-router';
import { getKnex } from './src/utils/knex.js';
import { getUserById } from '../services/users.js';

export const router = new Router();
