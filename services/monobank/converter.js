/* eslint-disable arrow-body-style */
const { get } = require('lodash');
const { DateTime } = require('luxon');

const convertBalanceInfo = (response) => {
  const cardBalance = get(response, 'accounts.0');

  return {
    cardNumber: get(cardBalance, 'maskedPan.0'),
    currency: get(cardBalance, 'cashbackType'),
    balance: (get(cardBalance, 'balance')) / 100,
    limit: (get(cardBalance, 'creditLimit')) / 100,
    clientName: get(response, 'name'),
  };
};

const convertDate = (dateTime) => DateTime
  .fromSeconds(dateTime)
  .toUTC()
  .toISO();

const convertTransactions = (response = []) => {
  return response.map((statement) => {
    const date = get(statement, 'time');

    return {
      externalId: get(statement, 'id'),
      date: convertDate(date),
      operationAmount: (get(statement, 'operationAmount')) / 100,
      balance: (get(statement, 'balance')) / 100,
      description: get(statement, 'description'),
      currency: 'UAH',
    };
  });
};

module.exports = {
  convertBalanceInfo,
  convertTransactions,
};
