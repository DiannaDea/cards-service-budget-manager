const router = require('koa-joi-router');

const testRouter = router();

testRouter.prefix('/cards-service/api/test/groups');

testRouter.route({
  method: 'get',
  path: '/',
  handler: (ctx) => ctx.send(200, [
    {
      id: 'aa9db47c-9aaa-4f64-97a9-f1b5fe118b7b',
      name: 'Private',
    },
    {
      id: 'fe69984c-7d35-41e0-925d-45270e7fae99',
      name: 'Family',
    },
    {
      id: '9cdd2afd-7245-440e-9b85-4c4297d8f687',
      name: 'Business',
    },
  ]),
});

module.exports = testRouter;
