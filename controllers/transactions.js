const { groupBy } = require('lodash');
const { DateTime } = require('luxon');

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
  getFilters: (ctx) => ctx.send(200, 'getFilters'),
  create: (ctx) => ctx.send(200, 'create'),
  update: (ctx) => ctx.send(200, 'update'),
  getOne: (ctx) => ctx.send(200, 'getOne'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = TransactionsController;
