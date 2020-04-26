const router = require('koa-joi-router');
const BanksController = require('../controllers/banks');

const banksRouter = router();

const { Joi } = router;

banksRouter.prefix('/cards-service/api/banks');

banksRouter.route({
  method: 'get',
  path: '/:id/cards',
  validate: {
    type: 'json',
    params: {
      id: Joi.number().required(),
    },
  },
  handler: [BanksController.getCards],
});

banksRouter.route({
  method: 'get',
  path: '/',
  validate: {
    query: {
      groupIds: Joi.string().required(),
    },
  },
  handler: [BanksController.getAll],
});

banksRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    type: 'json',
    query: {
      id: Joi.number().required(),
    },
  },
  handler: [BanksController.delete],
});

module.exports = banksRouter;
