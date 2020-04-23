const requester = require('../requester');
const { convertBalanceInfo } = require('./converter');

const routerConfig = {
  '/personal/client-info': {
    converter: (response) => convertBalanceInfo(response),
  },
  '/rest_fiz': {
    requester: (merchant, { card, startDate, endDate }) => (
      merchant.createStatementsRequestBody(card, startDate, endDate)
    ),
    converter: () => {},
  },
};

const requestMonobank = (url, requestInfo) => {
  const { token } = requestInfo;

  const config = routerConfig[url];

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
