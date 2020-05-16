module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Transactions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    externalId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    cardId: {
      type: Sequelize.UUID,
      references: {
        model: 'Cards',
        key: 'id',
      },
    },
    categoryId: {
      type: Sequelize.UUID,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    operationAmount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    balance: {
      type: Sequelize.FLOAT,
    },
    description: {
      type: Sequelize.STRING,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('Transactions'),
};
