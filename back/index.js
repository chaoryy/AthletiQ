import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { getKnex } from './src/utils/knex.js';
import { router } from './src/controllers/index.js';
import { authRouter } from './src/controllers/auth.js'

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
      if(e.isJoi){
        console.log('this is joi error');
        ctx.status = 400;
        ctx.body = {
          errors: e.message,
        };
        return;
      }
      console.log('caught in try-catch', e.message);
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
  app.use(authRouter.routes());
  app.use(async (ctx, next) => {
    if (['/register', '/login', '/logout'].includes(ctx.path)) {
      return next();
    }
    const { headers } = ctx.request;
    const { authorization } = headers;
    if (!authorization) {
      ctx.throw(401,'Authorization header is missing');
      return;
    }
  
    const token = authorization.split(' ')[1];

    if (!token) {
      ctx.throw(401,'Token is missing');
    }
      
    const { rows: [userInfo] } = await knex.raw(`
        select * from tokens
        inner join users
        on users.id = tokens.user_id
        where tokens.token = ?
        `, [token]);

        console.log(userInfo);

        if(!userInfo) {
          ctx.throw(401,'Not Authorized');
        }

        ctx.state.user = userInfo;
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
