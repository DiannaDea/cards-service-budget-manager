const router = require('koa-joi-router');
const TransactionsController = require('../controllers/transactions');

const transactionsRouter = router();

const { Joi } = router;

transactionsRouter.prefix('/cards-service/api/transactions');

transactionsRouter.route({
  method: 'get',
  path: '/filters',
  validate: {
    type: 'json',
    query: {
      userId: Joi.number().required(),
    },
  },
  handler: [TransactionsController.getFilters],
});

transactionsRouter.route({
  method: 'get',
  path: '/',
  validate: {
    type: 'json',
    query: {
      userId: Joi.number().required(),
      categoryId: Joi.number(),
      groupId: Joi.number(),
      bankId: Joi.number(),
      cardId: Joi.number(),
    },
  },
  handler: [TransactionsController.getAll],
});

transactionsRouter.route({
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: {
      groupId: Joi.number().required(),
      categoryId: Joi.number(),
      type: Joi.string().valid(['expence', 'income']).required(),
      description: Joi.string(),
      currency: Joi.string().required(),
      amount: Joi.number().required(),
    },
  },
  handler: [TransactionsController.create],
});

transactionsRouter.route({
  method: 'put',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.number().required(),
    },
    body: {
      groupId: Joi.number().required(),
      categoryId: Joi.number(),
      type: Joi.string().valid(['expence', 'income']).required(),
      description: Joi.string(),
      currency: Joi.string().required(),
      amount: Joi.number().required(),
    },
  },
  handler: [TransactionsController.update],
});

transactionsRouter.route({
  method: 'get',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.number().required(),
    },
  },
  handler: [TransactionsController.getOne],
});

transactionsRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.number().required(),
    },
  },
  handler: [TransactionsController.delete],
});

module.exports = transactionsRouter;