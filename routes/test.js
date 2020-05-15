const router = require('koa-joi-router');

const testRouter = router();

testRouter.prefix('/cards-service/api/test/groups');

testRouter.route({
  method: 'get',
  path: '/',
  handler: (ctx) => ctx.send(200, [
    {
      id: '1',
      name: 'Private',
    },
    {
      id: '2',
      name: 'Family',
    },
    {
      id: '3',
      name: 'Business',
    },
  ]),
});

module.exports = testRouter;
