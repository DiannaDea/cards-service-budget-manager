const requester = require('../requester');
const PrivatBankApi = require('./PrivatBankApi');
const { convertBalanceInfo, convertTransactions } = require('./converter');

const routerConfig = {
  '/balance': {
    requester: (merchant, { card }) => (
      merchant.createBalanceRequestBody(card)
    ),
    converter: (response) => convertBalanceInfo(response),
  },
  '/rest_fiz': {
    requester: (merchant, { card, startDate, endDate }) => (
      merchant.createStatementsRequestBody(card, startDate, endDate)
    ),
    converter: (response) => convertTransactions(response),
  },
};

const requestPrivatBank = (url, requestInfo) => {
  const merchant = new PrivatBankApi(requestInfo);

  const config = routerConfig[url];
  const xmlBody = config.requester(merchant, requestInfo);

  const options = {
    method: 'POST',
    uri: `https://api.privatbank.ua/p24api${url}`,
    headers: {
      'Content-Type': 'text/xml',
      'Content-Length': Buffer.byteLength(xmlBody),
    },
    body: xmlBody,
    json: false,
  };

  return requester(options).then((res) => {
    const convered = PrivatBankApi.convertBodyToJson(res);
    const data = config.converter(JSON.parse(convered));

    if (Array.isArray(data)) {
      return data;
    }

    if (data.balance) {
      return data;
    }

    return null;
  });
};

module.exports = requestPrivatBank;
