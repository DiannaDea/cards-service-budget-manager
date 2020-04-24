/* eslint-disable no-useless-escape */
const { get } = require('lodash');
const { DateTime } = require('luxon');

const AMOUNT_REGEX = /(?<amount>[-0-9\.]+)\s(?<currency>[A-Z]+)/;

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

const converMoney = (money) => {
  if (!AMOUNT_REGEX.test(money)) {
    return { amount: null, currency: null };
  }

  const { groups: { amount, currency } } = AMOUNT_REGEX.exec(money);

  return {
    amount: parseFloat(amount),
    currency,
  };
};

const convertTransactions = (response) => {
  const statements = get(response, 'response.data.info.statements.statement', []);

  return statements.map((statement) => {
    const attributes = get(statement, '_attributes');

    const terminal = get(attributes, 'terminal', '');
    const description = get(attributes, 'description', '');

    const date = get(attributes, 'trandate');
    const time = get(attributes, 'trantime');

    const operationAmount = converMoney(get(attributes, 'cardamount'));
    const balance = converMoney(get(attributes, 'rest'));

    return {
      date: convertDate(date, time),
      operationAmount: operationAmount.amount,
      balance: balance.amount,
      description: `${description} ${terminal}`,
      currency: operationAmount.currency,
    };
  });
};

module.exports = {
  convertBalanceInfo,
  convertTransactions,
};
