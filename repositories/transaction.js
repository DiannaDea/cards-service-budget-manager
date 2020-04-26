const { Transaction } = require('../db/models');

const TransactionRepository = {
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
