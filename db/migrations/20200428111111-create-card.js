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
    number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    limit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    clientName: {
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
  down: (queryInterface) => queryInterface.dropTable('Cards'),
};
