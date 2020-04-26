const { get } = require('lodash');
const { DateTime } = require('luxon');

const logger = require('../logger');

const requestMonobank = require('../monobank');
const requestPrivatBank = require('../privatbank');

const CardRepository = require('../../repositories/card');
const TransactionRepository = require('../../repositories/transaction');

const cardAuthConverter = {
  monobank: (card) => ({
    token: card.auth.monobankToken,
  }),
  privatbank: (card) => ({
    merchantId: card.auth.privatMerchantId,
    password: card.auth.privatMerchantSignature,
    cardNumber: card.cardNumber,
  }),
};

const transactionsStrategies = {
  monobank: async ({ token, cardNumber }, { startDate, endDate }) => {
    const monoInfo = { token, cardNumber };

    const startDateSec = DateTime.fromISO(startDate).toSeconds();
    const endDateSec = DateTime.fromISO(endDate).toSeconds();

    try {
      const monoTransactions = await requestMonobank(`/personal/statement/0/${startDateSec}/${endDateSec}`, monoInfo);
      return monoTransactions || [];
    } catch (error) {
      return [];
    }
  },
  privatbank: async ({
    merchantId, password, cardNumber, country = 'UA',
  }, { startDate, endDate }) => {
    const privatInfo = {
      merchantId,
      password,
      card: cardNumber,
      country,
      startDate: DateTime.fromISO(startDate).toFormat('dd.MM.yyyy'),
      endDate: DateTime.fromISO(endDate).toFormat('dd.MM.yyyy'),
    };

    try {
      const privatTransactions = await requestPrivatBank('/rest_fiz', privatInfo);
      return privatTransactions || null;
    } catch (error) {
      return null;
    }
  },
};

const joinBankAndAuth = (cards) => {
  const promises = cards.map(async (card) => {
    const cardAuth = await card.getCardAuth();
    const bank = await card.getBank();

    const cardInfo = card.get({ plain: true });

    return {
      ...cardInfo,
      bank: bank.get({ plain: true }),
      auth: cardAuth.get({ plain: true }),
    };
  });

  return Promise.all(promises);
};

const getCardTransactions = async (card) => {
  const strategy = get(card, 'bank.internalName');
  const bankDetails = cardAuthConverter[strategy](card);

  const transactionInfo = await transactionsStrategies[strategy](bankDetails, {
    startDate: '2020-04-10',
    endDate: '2020-04-20',
  });

  return transactionInfo.map((transaction) => ({
    ...transaction,
    cardId: card.id,
  }));
};

const insertTransaction = async (transactionInfo) => {
  try {
    await TransactionRepository.create({
      ...transactionInfo,
    });
  } catch (error) {
    logger.error('Duplicate id:', transactionInfo.externalId);
  }
};

const processCard = async (card) => {
  try {
    const transactions = await getCardTransactions(card);

    const promises = transactions.map((transaction) => insertTransaction(
      transaction,
    ));

    await Promise.all(promises).then(() => logger.info('==== Finished processing card id:', card.id));
    return true;
  } catch (error) {
    return false;
  }
};

const test = async () => {
  const cards = await CardRepository.findAll();
  const fullInfoCards = await joinBankAndAuth(cards);

  const processCardPromises = fullInfoCards.map((card) => processCard(card));

  await Promise
    .all(processCardPromises)
    .then(() => logger.info('Finished inserting transactions'));
};

test();
