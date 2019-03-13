import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';

import routes from './routes';
import { files } from './middlewares/files';

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(koaBody({ multipart: true }));
app.use(files);

app.use(routes.routes())

const server = app.listen(PORT, () => {
  console.log('Server runnig '+ PORT);
});

export default server;