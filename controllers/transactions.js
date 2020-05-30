const { groupBy, uniq } = require('lodash');
const { DateTime } = require('luxon');
const { uuid } = require('uuidv4');

const TransactionRepository = require('../repositories/transaction');
const BanksRepository = require('../repositories/bank');
const CardRepository = require('../repositories/card');
const CategoryRepository = require('../repositories/category');
const { getGroups } = require('../utils');

const groups = require('../groups');

const joinBank = (transactions, userId) => {
  const promises = transactions.map(async (transactionInfo) => {
    const card = await transactionInfo.getCard();
    const bank = await card.getBank();

    const category = await transactionInfo.getCategory();
    const transaction = transactionInfo.get({ plain: true });

    const group = await getGroups({ userId, groupIds: card.groupId });

    Object.assign(transaction, {
      card, bank, category, group: group ? group[0] : null,
    });

    return transaction;
  });

  return Promise.all(promises);
};

const processTransactions = async (filters, pagination, userId) => {
  const transactions = await TransactionRepository.findAllInDateRange(
    filters,
    pagination,
  );

  await joinBank(transactions.rows, userId);

  const grouped = groupBy(transactions.rows, (transaction) => DateTime
    .fromISO(transaction.date.toISOString())
    .toFormat('dd.MM.yyyy'));

  return {
    rows: grouped,
    count: transactions.count,
  };
};

const getFilters = async (cards) => {
  const banksPromises = cards.map((card) => card.getBank());
  const banks = await Promise.all(banksPromises);

  const cardIds = cards.map((card) => card.id);
  const groupIds = uniq(cards.map((card) => card.groupId));

  // TODO:
  const filterGroups = Object.values(groups).map((group) => {
    if (groupIds.includes(group.id)) {
      return group;
    }
    return null;
  }).filter(Boolean);

  const [minDate] = await TransactionRepository.getDate(cardIds, 'min');
  const [maxDate] = await TransactionRepository.getDate(cardIds, 'max');
  const categories = await CategoryRepository.getDistinct(cardIds);

  return {
    groups: filterGroups,
    banks,
    cards,
    categories,
    dates: {
      min: minDate.date,
      max: maxDate.date,
    },
  };
};

const createCustomCard = async ({ groupId }) => {
  const customBank = await BanksRepository.findOne({ internalName: 'custom' });
  return CardRepository.create({
    groupId,
    bankId: customBank.id,
    owner: 1,
  });
};

const TransactionsController = {
  getAll: async (ctx) => {
    const {
      groupIds, cardIds, bankIds, categoryIds, dateStart, dateEnd, limit, page, userId,
    } = ctx.request.query;

    const cards = await CardRepository
      .findAll({
        groupId: groupIds.split(','),
        ...(bankIds && { bankId: bankIds.split(',') }),
      }, ['id'])
      .reduce((ids, card) => [...ids, card.id], []);

    const endDateFormatted = DateTime
      .fromFormat(dateEnd, 'yyyy-MM-dd')
      .plus({ days: 1 })
      .toFormat('yyyy-MM-dd');

    const filters = {
      cardId: (!cardIds) ? cards : cardIds.split(','),
      ...(categoryIds && { categoryId: categoryIds.split(',') }),
      ...(dateStart && { dateStart }),
      ...(dateEnd && { dateEnd: endDateFormatted }),
    };

    const pagination = {
      offset: ((parseInt(page, 10) - 1) * parseInt(limit, 10)),
      limit: parseInt(limit, 10),
    };

    const transactions = await processTransactions(filters, pagination, userId);
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
      groupId, operationAmount, description, currency, categoryId,
    } = ctx.request.body;

    let customCard = await CardRepository.findOne({
      owner: 1,
      groupId,
    });

    if (!customCard) {
      customCard = await createCustomCard({ groupId });
    }

    const transaction = await TransactionRepository.create({
      cardId: customCard.id,
      externalId: uuid(),
      date: DateTime.local().toUTC().toISO(),
      operationAmount,
      description,
      currency,
      categoryId,
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
