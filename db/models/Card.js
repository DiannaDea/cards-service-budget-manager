module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    groupId: DataTypes.UUID,
    bankId: DataTypes.UUID,
    cardAuthId: DataTypes.UUID,
    owner: DataTypes.NUMBER,
    cardNumber: DataTypes.STRING,
    currency: DataTypes.STRING,
    balance: DataTypes.FLOAT,
    limit: DataTypes.FLOAT,
    clientName: DataTypes.STRING,
  }, {});

  Card.associate = (models) => {
    Card.belongsTo(models.Bank, { as: 'bank' });
    Card.belongsTo(models.CardAuth, { as: 'cardAuth' });
  };

  return Card;
};
