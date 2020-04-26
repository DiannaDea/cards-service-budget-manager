module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Cards', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    groupId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bankId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Banks',
        key: 'id',
      },
    },
    cardAuthId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'CardAuths',
        key: 'id',
      },
    },
    cardNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    limit: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    clientName: {
      type: Sequelize.STRING,
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
  down: (queryInterface) => queryInterface.dropTable('Cards'),
};
