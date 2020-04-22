const TransactionsController = {
  getAll: (ctx) => ctx.send(200, 'getAll'),
  getFilters: (ctx) => ctx.send(200, 'getFilters'),
  create: (ctx) => ctx.send(200, 'create'),
  update: (ctx) => ctx.send(200, 'update'),
  getOne: (ctx) => ctx.send(200, 'getOne'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = TransactionsController;
