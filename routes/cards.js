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
      monobank: Joi.object({
        token: Joi.string().required(),
        cardNumber: Joi.string().required(),
      }),
      privatbank: Joi.object({
        merchantId: Joi.string().required(),
        password: Joi.string().required(),
        cardNumber: Joi.string().required(),
      }),
    },
  },
  handler: [CardsController.auth],
});

cardsRouter.route({
  method: 'post',
  path: '/custom',
  validate: {
    type: 'json',
    body: {
      groupId: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
  },
  handler: [CardsController.createCustom],
});

cardsRouter.route({
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: {
      cardNumber: Joi.string().required(),
      groupId: Joi.string().guid({ version: 'uuidv4' }).required(),
      bankId: Joi.string().guid({ version: 'uuidv4' }).required(),
      authId: Joi.string().guid({ version: 'uuidv4' }).required(),
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
      id: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
    body: {
      groupId: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
  },
  handler: [CardsController.update],
});

cardsRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().guid({ version: 'uuidv4' }).required(),
    },
  },
  handler: [CardsController.delete],
});

module.exports = cardsRouter;
