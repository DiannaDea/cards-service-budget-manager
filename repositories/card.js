const { Card } = require('../db/models');

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
};

module.exports = CardRepository;
