import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { getKnex } from './src/utils/knex.js';
import Router from 'koa-router';

const router = new Router();

router.post('/users', async (ctx) => {
    console.log('post request to /users');

    ctx.status = 201;
    ctx.body = {};
})

async function main() {
    console.log('start', new Date());

    const knex = await getKnex();

    const res = await knex.raw('select  1 + 1 as sum');
    
    const app = new Koa();

    app.use(bodyparser());
    app.use(router.routes());
    app.listen(4200);

    app.use(async (ctx) => {
        ctx.body = {
            hello: 'world',
        };

        ctx.status = 200;
    });

    console.log(res.rows);

}

main().catch((e) => {
    console.log(e);
    process.exit(1);
});
