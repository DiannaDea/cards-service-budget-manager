const cardsRouter = require('./cards');
const transactionsRouter = require('./transactions');
const banksRouter = require('./banks');
const testRouter = require('./test');

module.exports = {
  routes: [
    cardsRouter.middleware(),
    transactionsRouter.middleware(),
    banksRouter.middleware(),
    testRouter.middleware(),
  ],
};
