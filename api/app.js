import Koa from 'koa';
import koaBody from 'koa-body';

import routes from './routes';

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(koaBody());
app.use(routes.routes())

const server = app.listen(PORT, () => {
  console.log('Server runnig '+ PORT);
});

export default server;