module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Keywords', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    categoryId: {
      type: Sequelize.UUID,
      references: {
        model: 'Categories',
        key: 'id',
      },
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
  down: (queryInterface) => queryInterface.dropTable('Keywords'),
};
