const requestMonobank = require('../services/monobank');
const requestPrivatBank = require('../services/privatbank');

const { encrypt, decrypt } = require('../services/encryptor');

const CardAuthRepository = require('../repositories/card-auth');
const BankRepository = require('../repositories/bank');
const CardRepository = require('../repositories/card');

const cardAuthConverter = {
  monobank: (cardAuth, cardNumber) => ({
    token: decrypt(cardAuth.monobankToken),
    cardNumber,
  }),
  privatbank: (cardAuth, cardNumber) => ({
    merchantId: decrypt(cardAuth.privatMerchantId),
    password: decrypt(cardAuth.privatMerchantSignature),
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
    monobankToken: encrypt(token),
  }),
  privatbank: ({ merchantId, password }) => ({
    privatMerchantId: encrypt(merchantId),
    privatMerchantSignature: encrypt(password),
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

    try {
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
    } catch (error) {
      return ctx.send(500, { error: error.message });
    }
  },
  createCustom: async (ctx) => {
    const { groupId } = ctx.request.body;

    const customBank = await BankRepository.findOne({ internalName: 'custom' });

    const card = await CardRepository.create({
      owner: 1,
      groupId,
      bankId: customBank.id,
    });

    return ctx.send(200, card);
  },
  create: async (ctx) => {
    const {
      groupId, bankId, authId, cardNumber,
    } = ctx.request.body;

    try {
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
        owner: 0,
        groupId,
        bankId,
        cardAuthId: authId,
        ...balance,
      });

      return ctx.send(200, card);
    } catch (error) {
      return ctx.send(500, { error: error.message });
    }
  },
  update: async (ctx) => {
    const { id } = ctx.params;

    // TODO: check if group exists
    // const { groupId } = ctx.request.body;

    try {
      const card = await CardRepository.findOne({ id });

      if (!card) {
        return ctx.send(404, `No card with such id: ${id}`);
      }

      const isUpdated = await CardRepository.update(id, ctx.request.body);

      return (isUpdated)
        ? ctx.send(200, { success: true })
        : ctx.send(500, { success: false, error: `Unable to update card with id: ${id}` });
    } catch (error) {
      return ctx.send(500, { error: error.message });
    }
  },
  delete: async (ctx) => {
    const { id } = ctx.params;

    try {
      const card = await CardRepository.findOne({ id });

      if (!card) {
        return ctx.send(404, `No card with such id: ${id}`);
      }

      const isDeleted = await CardRepository.delete(id);

      return (isDeleted)
        ? ctx.send(200, { success: true })
        : ctx.send(500, { success: false, error: `Unable to delete card with id: ${id}` });
    } catch (error) {
      return ctx.send(500, { error: error.message });
    }
  },
};

module.exports = CardsController;
