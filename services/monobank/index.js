const requester = require('../requester');
const { convertBalanceInfo, convertTransactions } = require('./converter');

const routerConfig = {
  '/personal/client-info': {
    converter: (response) => convertBalanceInfo(response),
  },
  '/personal/statement': {
    requester: (merchant, { card, startDate, endDate }) => (
      merchant.createStatementsRequestBody(card, startDate, endDate)
    ),
    converter: (response) => convertTransactions(response),
  },
};

const requestMonobank = (url, requestInfo) => {
  const { token } = requestInfo;

  const route = Object.keys(routerConfig).find((r) => url.includes(r));
  const config = routerConfig[route];

  const options = {
    uri: `https://api.monobank.ua${url}`,
    headers: {
      'X-Token': token,
    },
    json: true,
  };

  return requester(options).then((response) => config.converter(response));
};

module.exports = requestMonobank;
