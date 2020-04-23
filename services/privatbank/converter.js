const { get } = require('lodash');
const { DateTime } = require('luxon');

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

const convertDate = (date, time) => DateTime
  .fromISO(`${date}T${time}`)
  .toUTC()
  .toISO();

const convertTransactions = (response) => {
  const statements = get(response, 'response.data.info.statements.statement', []);

  return statements.map((statement) => {
    const attributes = get(statement, '_attributes');

    const terminal = get(attributes, 'terminal', '');
    const description = get(attributes, 'description', '');

    const date = get(attributes, 'trandate');
    const time = get(attributes, 'trantime');

    return {
      date: convertDate(date, time),
      operationAmount: get(attributes, 'cardamount'),
      balance: get(attributes, 'rest'),
      description: `${description} ${terminal}`,
    };
  });
};

module.exports = {
  convertBalanceInfo,
  convertTransactions,
};
