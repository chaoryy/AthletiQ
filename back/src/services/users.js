import { getKnex } from '../utils/knex.js';

export async function getUserById(id) {
  const knex = await getKnex();
  const user = await knex('users')
    .where({ id })
    .first();

  return user;
}
