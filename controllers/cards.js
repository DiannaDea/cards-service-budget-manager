const requestMonobank = require('../services/monobank');
const requestPrivatBank = require('../services/privatbank');

const CardAuthRepository = require('../repositories/card-auth');
const BankRepository = require('../repositories/bank');
const CardRepository = require('../repositories/card');

const cardAuthConverter = {
  monobank: (cardAuth, cardNumber) => ({
    token: cardAuth.monobankToken,
    cardNumber,
  }),
  privatbank: (cardAuth, cardNumber) => ({
    merchantId: cardAuth.privatMerchantId,
    password: cardAuth.privatMerchantSignature,
    cardNumber,
  }),
};

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

    if (await CardAuthRepository.findOne(cardAuthDetails)) {
      return ctx.send(200, 'Bank already authed');
    }

    const bank = await BankRepository.findOne({ internalName: strategy });

    const balance = await balanceStrategies[strategy](bankDetails);
    if (!balance) {
      return ctx.send(401, { authId: null, success: false, message: 'Invalid card' });
    }

    const cardAuth = await CardAuthRepository.create(cardAuthDetails);

    return ctx.send(200, {
      cardNumber: bankDetails.cardNumber,
      bankId: bank.id,
      authId: cardAuth.id,
      success: true,
    });
  },
  create: async (ctx) => {
    const {
      groupId, bankId, authId, cardNumber,
    } = ctx.request.body;

    const cardAuth = await CardAuthRepository.findOne({ id: authId });
    if (!cardAuth) {
      return ctx.send(404, 'Bank not authed');
    }

    const bank = await BankRepository.findOne({ id: bankId });
    if (!bank) {
      return ctx.send(404, 'Bank not authed');
    }

    const strategy = bank.internalName;

    const bankDetails = cardAuthConverter[strategy](cardAuth, cardNumber);
    const balance = await balanceStrategies[strategy](bankDetails);

    const card = await CardRepository.create({
      groupId,
      bankId,
      cardAuthId: authId,
      ...balance,
    });

    return ctx.send(200, card);
  },
  update: (ctx) => ctx.send(200, 'update'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = CardsController;
