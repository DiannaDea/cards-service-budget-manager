const { Card, sequelize } = require('../db/models');

const CardAuthController = require('./card-auth');
const TransactionRepository = require('./transaction');

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
  findAll: (conditions, attributes = []) => Card.findAll({
    where: conditions,
    ...((attributes.length) ? { attributes } : {}),
  }),
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

    const areTransactionsDeleted = await TransactionRepository.deleteMany({ cardId: card.id });

    if (!areTransactionsDeleted) {
      return false;
    }

    try {
      await card.destroy();
    } catch (error) {
      return false;
    }

    const isCardAuthDeleted = await CardAuthController.delete(card.cardAuthId);
    return isCardAuthDeleted;
  }),
};

module.exports = CardRepository;
