/* eslint-disable no-param-reassign */
const { get } = require('lodash');
const { DateTime } = require('luxon');

const logger = require('../logger');

const { decrypt } = require('../encryptor');

const requestMonobank = require('../monobank');
const requestPrivatBank = require('../privatbank');

const CardRepository = require('../../repositories/card');
const TransactionRepository = require('../../repositories/transaction');
const CategoryRepository = require('../../repositories/category');

const cardAuthConverter = {
  monobank: (card) => ({
    token: decrypt(card.auth.monobankToken),
  }),
  privatbank: (card) => ({
    merchantId: decrypt(card.auth.privatMerchantId),
    password: decrypt(card.auth.privatMerchantSignature),
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

  const now = DateTime.local();
  const yesterday = now.minus({ days: 3 });

  const transactionInfo = await transactionsStrategies[strategy](bankDetails, {
    startDate: yesterday.toFormat('yyyy-MM-dd'),
    endDate: now.toFormat('yyyy-MM-dd'),
  });

  return transactionInfo.map((transaction) => ({
    ...transaction,
    cardId: card.id,
  }));
};


const getRandomInt = (categories) => {
  const min = 0;
  const max = categories.length;
  const pos = Math.floor(Math.random() * (max - min)) + min;
  return categories[pos].id;
};

const insertTransaction = async (transactionInfo) => {
  try {
    const categories = await CategoryRepository.findAll();
    await TransactionRepository.create({
      ...transactionInfo,
      // TODO: fix !!!
      categoryId: getRandomInt(categories),
    });
  } catch (error) {
    logger.error(`Duplicate id: ${transactionInfo.externalId}`);
  }
};

const processCard = async (card) => {
  try {
    const transactions = await getCardTransactions(card);

    const promises = transactions.map((transaction) => insertTransaction(
      transaction,
    ));

    await Promise.all(promises).then(() => logger.info(`==== Finished processing card id: ${card.id}`));
    return true;
  } catch (error) {
    return false;
  }
};

const checkTransactions = async () => {
  const cards = await CardRepository.findAll();
  const fullInfoCards = await joinBankAndAuth(cards);

  const processCardPromises = fullInfoCards.map((card) => processCard(card));

  await Promise
    .all(processCardPromises)
    .then(() => logger.info('Finished inserting transactions'));
};

module.exports = checkTransactions;
