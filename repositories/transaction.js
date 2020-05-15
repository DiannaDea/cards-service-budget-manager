const { Transaction, Sequelize } = require('../db/models');

const TransactionRepository = {
  create: async (transactionInfo) => {
    try {
      return Transaction
        .build({
          ...transactionInfo,
          createdAt: new Date(),
          updatedAd: new Date(),
        })
        .save();
    } catch (error) {
      return null;
    }
  },
  findAllInDateRange: (conditions, date) => Transaction.findAll({
    where: {
      ...conditions,
      date: {
        [Sequelize.Op.gte]: date,
      },
    },
    order: [
      ['date', 'DESC'],
    ],
  }),
  findAll: (conditions) => Transaction.findAll({ where: conditions }),
  deleteMany: async (conditions) => {
    try {
      await Transaction.destroy({ where: conditions });
      return true;
    } catch (error) {
      return false;
    }
  },
  findOne: (conditions) => Transaction.findOne({ where: conditions }),
  delete: async (id) => {
    try {
      const transaction = await TransactionRepository.findOne({ id });
      await transaction.destroy();
      return true;
    } catch (error) {
      return false;
    }
  },
  update: async (id, info) => {
    try {
      await Transaction.update(info, { where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  },
  getDate(cardIds, type) {
    return Transaction.findAll({
      attributes: [[Sequelize.fn(type, Sequelize.col('date')), 'date']],
      where: {
        cardId: {
          [Sequelize.Op.in]: cardIds,
        },
      },
    });
  },
};

module.exports = TransactionRepository;
