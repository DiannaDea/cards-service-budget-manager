module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    internalName: DataTypes.STRING,
  }, {});

  return Category;
};
