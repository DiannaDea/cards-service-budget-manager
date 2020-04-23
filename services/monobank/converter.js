const { get } = require('lodash');

const convertBalanceInfo = (response) => {
  const cardBalance = get(response, 'accounts.0');

  return {
    cardNumber: null,
    currency: get(cardBalance, 'cashbackType'),
    balance: get(cardBalance, 'balance'),
    limit: get(cardBalance, 'creditLimit'),
    clientName: get(response, 'name'),
  };
};

module.exports = {
  convertBalanceInfo,
};
