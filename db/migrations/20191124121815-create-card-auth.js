module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CardAuths', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    monobankToken: {
      type: Sequelize.STRING,
    },
    privatMerchantId: {
      type: Sequelize.STRING,
    },
    privatMerchantSignature: {
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
  down: (queryInterface) => queryInterface.dropTable('CardAuths'),
};
