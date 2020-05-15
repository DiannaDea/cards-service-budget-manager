const { groupBy } = require('lodash');
const { DateTime } = require('luxon');
const { uuid } = require('uuidv4');

const TransactionRepository = require('../repositories/transaction');
const CardRepository = require('../repositories/card');
const CategoryRepository = require('../repositories/category');

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

  const cardIds = cards.map((card) => card.id);

  const [minDate] = await TransactionRepository.getDate(cardIds, 'min');
  const [maxDate] = await TransactionRepository.getDate(cardIds, 'max');
  const categories = await CategoryRepository.getDistinct(cardIds);

  return {
    banks,
    cards,
    categories,
    dates: {
      min: minDate.date,
      max: maxDate.date,
    },
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
  checkIfExists: async (ctx, next) => {
    const { id } = ctx.params;

    const transaction = await TransactionRepository.findOne({ id });

    if (!transaction) {
      return ctx.send(404, `No transaction with id: ${id}`);
    }
    ctx.transaction = transaction;
    return next();
  },
  update: async (ctx) => {
    const { id } = ctx.params;
    const { transaction } = ctx;

    const initialTransactionCard = await transaction.getCard();

    const { groupId } = ctx.request.body;

    if (groupId) {
      const card = await CardRepository.findOne({
        groupId,
        owner: initialTransactionCard.owner,
      });

      if (card) {
        Object.assign(ctx.request.body, {
          cardId: card.id,
        });
      }
    }

    const isUpdated = await TransactionRepository.update(id, ctx.request.body);

    return (isUpdated)
      ? ctx.send(200, { success: true })
      : ctx.send(500, { success: false, error: `Unable to update transaction with id: ${id}` });
  },
  getOne: async (ctx) => {
    const { transaction } = ctx;
    await joinBank([transaction]);
    return ctx.send(200, transaction);
  },
  delete: async (ctx) => {
    const { id } = ctx.params;
    const isDeleted = await TransactionRepository.delete(id);

    return (isDeleted)
      ? ctx.send(200, { success: true })
      : ctx.send(500, { success: false, error: `Unable to delete transaction with id: ${id}` });
  },
};

module.exports = TransactionsController;
