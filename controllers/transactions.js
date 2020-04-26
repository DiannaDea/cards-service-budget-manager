const { groupBy } = require('lodash');
const { DateTime } = require('luxon');
const { uuid } = require('uuidv4');

const TransactionRepository = require('../repositories/transaction');
const CardRepository = require('../repositories/card');

const joinBank = (transactions) => {
  const promises = transactions.map(async (transactionInfo) => {
    const card = await transactionInfo.getCard();
    const bank = await card.getBank();

    const transaction = transactionInfo.get({ plain: true });

    Object.assign(transaction, { card, bank });
    return transaction;
  });

  return Promise.all(promises);
};

const processTransactions = async (cardIds, date) => {
  const transactions = await TransactionRepository.findAllInDateRange({
    cardId: cardIds,
  }, date);

  await joinBank(transactions);

  const grouped = groupBy(transactions, (transaction) => DateTime
    .fromISO(transaction.date.toISOString())
    .toFormat('dd.MM.yyyy'));

  return grouped;
};

const getFilters = async (cards) => {
  const banksPromises = cards.map((card) => card.getBank());
  const banks = await Promise.all(banksPromises);

  return {
    banks,
    cards,
  };
};

const TransactionsController = {
  getAll: async (ctx) => {
    const {
      groupIds, cardIds, bankIds, date,
    } = ctx.request.query;

    const cards = await CardRepository
      .findAll({
        groupId: groupIds.split(','),
        ...(bankIds && { bankId: bankIds.split(',') }),
      }, ['id'])
      .reduce((ids, card) => [...ids, card.id], []);

    const transactions = await processTransactions(
      (!cardIds) ? cards : cardIds.split(','),
      date,
    );
    return ctx.send(200, transactions);
  },
  getFilters: async (ctx) => {
    const { groupIds } = ctx.request.query;

    const cards = await CardRepository
      .findAll({ groupId: groupIds.split(',') });

    const filters = await getFilters(cards);
    return ctx.send(200, filters);
  },
  create: async (ctx) => {
    const {
      groupId, operationAmount, description, currency,
    } = ctx.request.body;

    const customCard = await CardRepository.findOne({
      owner: 1,
      groupId,
    });

    const transaction = await TransactionRepository.create({
      cardId: customCard.id,
      externalId: uuid(),
      date: DateTime.local().toUTC().toISO(),
      operationAmount,
      description,
      currency,
    });

    return ctx.send(200, transaction);
  },
  update: (ctx) => ctx.send(200, 'update'),
  getOne: (ctx) => ctx.send(200, 'getOne'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = TransactionsController;
