const requestMonobank = require('../services/monobank');
const requestPrivatBank = require('../services/privatbank');

const CardAuthController = require('../repositories/card-auth');

const balanceStrategies = {
  monobank: async ({ token, cardNumber }) => {
    const monoInfo = { token, cardNumber };

    try {
      const monoBalance = await requestMonobank('/personal/client-info', monoInfo);
      return monoBalance || null;
    } catch (error) {
      return null;
    }
  },
  privatbank: async ({
    merchantId, password, cardNumber, country = 'UA',
  }) => {
    const privatInfo = {
      merchantId,
      password,
      card: cardNumber,
      country,
    };

    try {
      const privatBalance = await requestPrivatBank('/balance', privatInfo);
      return privatBalance || null;
    } catch (error) {
      return null;
    }
  },
};

const getBalanceStrategy = (requestBody) => {
  if (requestBody.monobank) {
    return 'monobank';
  }

  if (requestBody.privatbank) {
    return 'privatbank';
  }

  return null;
};

const cardAuthStrategies = {
  monobank: ({ token }) => ({
    monobankToken: token,
  }),
  privatbank: ({ merchantId, password }) => ({
    privatMerchantId: merchantId,
    privatMerchantSignature: password,
  }),
};

const CardsController = {
  auth: async (ctx) => {
    const strategy = getBalanceStrategy(ctx.request.body);

    const bankDetails = ctx.request.body[strategy];

    if (!strategy) {
      return ctx.send(404, 'Bank is not supported');
    }

    const cardAuthDetails = cardAuthStrategies[strategy](bankDetails);

    if (await CardAuthController.findOne(cardAuthDetails)) {
      return ctx.send(200, 'Bank already authed');
    }

    const balance = await balanceStrategies[strategy](bankDetails);

    if (!balance) {
      return ctx.send(401, { authId: null, success: false, message: 'Invalid card' });
    }

    const cardAuth = await CardAuthController.create(cardAuthDetails);

    return ctx.send(200, {
      authId: cardAuth.id,
      success: true,
    });
  },
  create: (ctx) => ctx.send(200, 'create'),
  update: (ctx) => ctx.send(200, 'update'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = CardsController;
