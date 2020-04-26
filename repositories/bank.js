const { Bank } = require('../db/models');

const BankRepository = {
  findOne: (conditions) => Bank.findOne({ where: conditions }),
};

module.exports = BankRepository;
