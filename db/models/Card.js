module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    groupId: DataTypes.STRING,
    bankId: DataTypes.NUMBER,
    cardAuthId: DataTypes.NUMBER,
    cardNumber: DataTypes.STRING,
    currency: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    limit: DataTypes.FLOAT,
    clientName: DataTypes.STRING,
  }, {});

  return Card;
};
