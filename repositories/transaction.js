const { Transaction } = require('../db/models');

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
  findAll: (conditions) => Transaction.findAll({ where: conditions }),
  deleteMany: async (conditions) => {
    try {
      await Transaction.destroy({ where: conditions });
      return true;
    } catch (error) {
      return false;
    }
  },
};

module.exports = TransactionRepository;
