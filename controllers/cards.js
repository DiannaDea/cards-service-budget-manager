const CardsController = {
  auth: (ctx) => ctx.send(200, 'auth'),
  create: (ctx) => ctx.send(200, 'create'),
  update: (ctx) => ctx.send(200, 'update'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = CardsController;
