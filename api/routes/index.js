import Router from 'koa-router';

import controllers from '../controllers';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    statusCode: 200,
    message: 'APi recordings',
  };
});

router.get('/api/recordings', controllers.getAll);
router.post('/api/recordings', controllers.add);
router.put('/api/recordings/:id', controllers.update);
router.delete('/api/recordings/:id', controllers.remove);

export default router;
