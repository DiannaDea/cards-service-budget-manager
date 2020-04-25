const { CardAuth } = require('../db/models');

const CardAuthController = {
  create: async (cardAuthInfo) => {
    try {
      return CardAuth
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
  findOne: (conditions) => CardAuth.findOne({ where: conditions }),
};

module.exports = CardAuthController;
