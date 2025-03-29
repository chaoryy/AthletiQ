import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { getKnex } from './src/utils/knex.js';
import { router } from './src/controllers/index.js';

async function main() {
  console.log('start', new Date());

  const knex = await getKnex();

  const res = await knex.raw('select  1 + 1 as sum');

  const app = new Koa();

  app.use(bodyparser());
  app.use((async(ctx, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);

      ctx.status = 500;
      ctx.body = {
        message: e.message,
      };
    }

  }))
  app.use(async(ctx, next) => {
    console.log(ctx.method, ctx.url, ctx.body);

    return next();
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(async (ctx) => {
    ctx.body = {
      hello: 'world',
    };

    ctx.status = 200;
  });

  console.log(res.rows);

  app.listen(4200, () => {
    console.log('server started at port 4200');
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
