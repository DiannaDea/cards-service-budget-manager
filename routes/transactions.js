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
      dateStart: Joi.string(),
      dateEnd: Joi.string(),
      cardIds: Joi.string(),
      bankIds: Joi.string(),
      categoryIds: Joi.string(),
      limit: Joi.string().required(),
      page: Joi.string().required(),
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
      groupId: Joi.string().guid({ version: 'uuidv4' }).required(),
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
      id: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
    body: {
      groupId: Joi.string().guid({ version: 'uuidv4' }).required(),
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
      id: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
  },
  handler: [TransactionsController.checkIfExists, TransactionsController.getOne],
});

transactionsRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
  },
  handler: [TransactionsController.checkIfExists, TransactionsController.delete],
});

module.exports = transactionsRouter;
