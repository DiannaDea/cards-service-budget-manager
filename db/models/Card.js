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

  Card.associate = (models) => {
    Card.belongsTo(models.Bank, { as: 'bank' });
  };

  return Card;
};
