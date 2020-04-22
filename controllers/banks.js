const BanksController = {
  getAll: (ctx) => ctx.send(200, 'auth'),
  getCards: (ctx) => ctx.send(200, 'getCards'),
  delete: (ctx) => ctx.send(200, 'delete'),
};

module.exports = BanksController;
