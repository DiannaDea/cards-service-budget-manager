const { v4: uuidv4 } = require('uuid');

const categoryNames = [
  'Food', 'Sport', 'Transport', 'Beauty', 'Health', 'Purchase', 'Transfer', 'Other',
];

module.exports = {
  up: async (queryInterface) => {
    const categories = await Promise.all(categoryNames.map((category) => ({
      id: uuidv4(),
      name: category,
      internalName: category.toLocaleLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })));

    return queryInterface.bulkInsert('Categories', categories, {});
  },
  down: (queryInterface) => Promise.all(
    categoryNames.map((category) => queryInterface.bulkDelete(
      'Categories',
      { name: category },
    )),
  ),
};
