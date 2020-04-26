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
    },
    owner: {
      type: Sequelize.INTEGER,
    },
    currency: {
      type: Sequelize.STRING,
    },
    balance: {
      type: Sequelize.FLOAT,
    },
    limit: {
      type: Sequelize.FLOAT,
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
