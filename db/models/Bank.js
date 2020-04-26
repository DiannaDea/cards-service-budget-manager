module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    name: DataTypes.STRING,
    internalName: DataTypes.STRING,
  }, {});

  return Bank;
};
