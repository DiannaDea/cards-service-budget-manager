const { v4: uuidv4 } = require('uuid');
const { Transaction, Sequelize } = require('../db/models');

const TransactionRepository = {
  create: async (transactionInfo) => {
    try {
      return Transaction
        .build({
          ...transactionInfo,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAd: new Date(),
        })
        .save();
    } catch (error) {
      return null;
    }
  },
  findAllInDateRange: async ({ dateStart, dateEnd, ...conditions }, pagination) => {
    const date = (dateStart || dateEnd)
      ? {
        ...(dateStart && { [Sequelize.Op.gte]: dateStart }),
        ...(dateEnd && { [Sequelize.Op.lte]: dateEnd }),
      }
      : null;

    return Transaction.findAndCountAll({
      where: {
        ...conditions,
        ...(date && { date }),
      },
      order: [
        ['date', 'DESC'],
      ],
      ...pagination,
    });
  },
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
