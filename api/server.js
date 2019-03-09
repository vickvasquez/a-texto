import Koa from 'koa';

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(ctx => {
  ctx.body = {};
});

const server = app.listen(PORT, () => {
  console.log('Server runnig '+ PORT);
});

module.exports = server;	

