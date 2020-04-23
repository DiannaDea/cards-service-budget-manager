/* eslint-disable arrow-body-style */
const { get } = require('lodash');
const { DateTime } = require('luxon');

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

const convertDate = (dateTime) => DateTime
  .fromSeconds(dateTime)
  .toUTC()
  .toISO();

const convertTransactions = (response = []) => {
  return response.map((statement) => {
    const date = get(statement, 'time');

    return {
      date: convertDate(date),
      operationAmount: get(statement, 'operationAmount'),
      balance: get(statement, 'balance'),
      description: get(statement, 'description'),
    };
  });
};

module.exports = {
  convertBalanceInfo,
  convertTransactions,
};
