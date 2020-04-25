module.exports = (sequelize, DataTypes) => {
  const CardAuth = sequelize.define('CardAuth', {
    monobankToken: DataTypes.STRING,
    privatMerchantId: DataTypes.STRING,
    privatMerchantSignature: DataTypes.STRING,
  }, {});

  return CardAuth;
};
