const cardsRouter = require('./cards');
const transactionsRouter = require('./transactions');
const banksRouter = require('./banks');

module.exports = {
  routes: [
    cardsRouter.middleware(),
    transactionsRouter.middleware(),
    banksRouter.middleware(),
  ],
};
