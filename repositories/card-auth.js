const { v4: uuidv4 } = require('uuid');
const { CardAuth } = require('../db/models');

const CardAuthController = {
  create: async (cardAuthInfo) => {
    try {
      return CardAuth
        .build({
          ...cardAuthInfo,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAd: new Date(),
        })
        .save();
    } catch (error) {
      return null;
    }
  },
  findOne: (conditions) => CardAuth.findOne({ where: conditions }),
  findAll: (conditions) => CardAuth.findAll({ where: conditions }),
  delete: async (id) => {
    try {
      const cardAuth = await CardAuthController.findOne({ id });

      if (cardAuth) {
        await cardAuth.destroy();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },
};

module.exports = CardAuthController;
