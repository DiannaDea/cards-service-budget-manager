const cron = require('node-cron');

const checkTransactions = require('./checkTransactions');

const runCron = () => {
  cron.schedule('*/45 * * * *', () => {
    checkTransactions();
  });
};

module.exports = runCron;
