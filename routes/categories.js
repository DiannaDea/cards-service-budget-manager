const router = require('koa-joi-router');
const CategoryController = require('../controllers/categories');

const categoryRouter = router();

categoryRouter.prefix('/cards-service/api/categories');

categoryRouter.route({
  method: 'get',
  path: '/',
  handler: CategoryController.getAll,
});

module.exports = categoryRouter;
