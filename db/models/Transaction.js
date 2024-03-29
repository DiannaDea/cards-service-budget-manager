module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    cardId: DataTypes.UUID,
    externalId: DataTypes.STRING,
    date: DataTypes.DATE,
    operationAmount: DataTypes.FLOAT,
    balance: DataTypes.FLOAT,
    description: DataTypes.STRING,
    currency: DataTypes.STRING,
  }, {});

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Card, { as: 'card' });
    Transaction.belongsTo(models.Category, { as: 'category' });
  };

  return Transaction;
};
