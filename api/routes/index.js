import Router from 'koa-router';

import controllers from '../controllers';

const router = new Router();

router.get('/', async ctx => {
  ctx.body = {
    status: 'success',
    statusCode: 200,
    message: 'APi records'
  };
})

router.post('/api/add', controllers.add)

export default router;