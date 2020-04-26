const { Card, sequelize } = require('../db/models');

const CardAuthController = require('./card-auth');
// const TransactionRepository = require('./transaction');

const CardRepository = {
  create: async (cardAuthInfo) => {
    try {
      return Card
        .build({
          ...cardAuthInfo,
          createdAt: new Date(),
          updatedAd: new Date(),
        })
        .save();
    } catch (error) {
      return null;
    }
  },
  findOne: (conditions) => Card.findOne({ where: conditions }),
  findAll: (conditions) => Card.findAll({ where: conditions }),
  update: async (id, info) => {
    try {
      await Card.update(info, { where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  },
  delete: (id) => sequelize.transaction(async () => {
    const card = await Card.findOne({ where: { id } });

    try {
      await card.destroy();
    } catch (error) {
      return false;
    }

    const isCardAuthDeleted = await CardAuthController.delete(card.cardAuthId);

    if (!isCardAuthDeleted) {
      return false;
    }

    return true;

    // TODO: delete transactions
    // const areTransactionsDeleted = await TransactionRepository.deleteMany({})
  }),
};

module.exports = CardRepository;
