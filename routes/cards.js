const router = require('koa-joi-router');
const CardsController = require('../controllers/cards');

const cardsRouter = router();

const { Joi } = router;

cardsRouter.prefix('/cards-service/api/cards');

cardsRouter.route({
  method: 'post',
  path: '/auth',
  validate: {
    type: 'json',
    body: {
      monobankToken: Joi.string().required(),
      privatMerchantId: Joi.string().required(),
      privatMerchantSignature: Joi.string().required(),
    },
  },
  handler: [CardsController.auth],
});

cardsRouter.route({
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: {
      groupId: Joi.number().required(),
      bankId: Joi.number().required(),
      authId: Joi.number().required(),
    },
  },
  handler: [CardsController.create],
});

cardsRouter.route({
  method: 'put',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.number().required(),
    },
    body: {
      groupId: Joi.number().required(),
    },
  },
  handler: [CardsController.update],
});

cardsRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.number().required(),
    },
  },
  handler: [CardsController.delete],
});

module.exports = cardsRouter;
