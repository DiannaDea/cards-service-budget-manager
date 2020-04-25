module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    groupId: DataTypes.STRING,
    bankId: DataTypes.NUMBER,
    cardAuthId: DataTypes.NUMBER,
    number: DataTypes.STRING,
    currency: DataTypes.STRING,
    balance: DataTypes.NUMBER,
    limit: DataTypes.NUMBER,
    clientName: DataTypes.STRING,
  }, {});

  return Card;
};
