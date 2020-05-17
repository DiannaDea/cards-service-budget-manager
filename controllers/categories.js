const CategoryRepository = require('../repositories/category');

const CategoryController = {
  getAll: async (ctx) => {
    const categories = await CategoryRepository.findAll();
    return ctx.send(200, categories);
  },
};

module.exports = CategoryController;
