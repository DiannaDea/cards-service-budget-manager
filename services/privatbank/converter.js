const { get } = require('lodash');

const convertBalanceInfo = (response) => {
  const cardBalance = get(response, 'response.data.info.cardbalance');

  return {
    cardNumber: get(cardBalance, 'card.card_number._text'),
    currency: get(cardBalance, 'card.currency._text'),
    balance: get(cardBalance, 'balance._text'),
    limit: get(cardBalance, 'fin_limit._text'),
    clientName: null,
  };
};

module.exports = {
  convertBalanceInfo,
};
