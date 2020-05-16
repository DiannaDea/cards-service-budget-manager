module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CardAuths', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
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
