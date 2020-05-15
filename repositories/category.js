const { Category, Transaction, Sequelize } = require('../db/models');

const CategoryRepository = {
  findOne: (conditions) => Category.findOne({ where: conditions }),
  findAll: (conditions) => Category.findAll({ where: conditions }),
  getDistinct: async (cardIds) => {
    const transactions = await Transaction.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('categoryId')), 'categoryId'],
      ],
      where: {
        cardId: {
          [Sequelize.Op.in]: cardIds,
        },
      },
    });
    const categoryIds = transactions.map((category) => category.categoryId);

    return Category.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: categoryIds,
        },
      },
    });
  },
};

module.exports = CategoryRepository;
