module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    externalId: DataTypes.STRING,
    date: DataTypes.DATE,
    operationAmount: DataTypes.FLOAT,
    balance: DataTypes.FLOAT,
    description: DataTypes.STRING,
    currency: DataTypes.STRING,
  }, {});

  return Transaction;
};
