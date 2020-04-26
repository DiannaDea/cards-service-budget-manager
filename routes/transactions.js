const router = require('koa-joi-router');
const TransactionsController = require('../controllers/transactions');

const transactionsRouter = router();

const { Joi } = router;

transactionsRouter.prefix('/cards-service/api/transactions');

transactionsRouter.route({
  method: 'get',
  path: '/filters',
  validate: {
    query: {
      groupIds: Joi.string().required(),
    },
  },
  handler: [TransactionsController.getFilters],
});

transactionsRouter.route({
  method: 'get',
  path: '/',
  validate: {
    query: {
      groupIds: Joi.string().required(),
      date: Joi.string().required(),
      cardIds: Joi.string(),
      bankIds: Joi.string(),
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
      groupId: Joi.string().required(),
      operationAmount: Joi.number().required(),
      description: Joi.string(),
      currency: Joi.string().required(),
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
      groupId: Joi.string().required(),
      operationAmount: Joi.number().required(),
      description: Joi.string(),
      currency: Joi.string().required(),
    },
  },
  handler: [TransactionsController.checkIfExists, TransactionsController.update],
});

transactionsRouter.route({
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.number().required(),
    },
  },
  handler: [TransactionsController.checkIfExists, TransactionsController.getOne],
});

transactionsRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    params: {
      id: Joi.number().required(),
    },
  },
  handler: [TransactionsController.checkIfExists, TransactionsController.delete],
});

module.exports = transactionsRouter;
