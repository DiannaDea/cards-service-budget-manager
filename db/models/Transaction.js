module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    cardId: DataTypes.STRING,
    externalId: DataTypes.STRING,
    date: DataTypes.DATE,
    operationAmount: DataTypes.FLOAT,
    balance: DataTypes.FLOAT,
    description: DataTypes.STRING,
    currency: DataTypes.STRING,
  }, {});

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Card, { as: 'card' });
  };

  return Transaction;
};
