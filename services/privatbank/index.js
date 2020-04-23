const requester = require('../requester');
const PrivatBankApi = require('./PrivatBankApi');

const requestBody = {
  '/balance': (merchant, { card }) => (
    merchant.createBalanceRequestBody(card)
  ),
  '/rest_fiz': (merchant, { card, startDate, endDate }) => (
    merchant.createStatementsRequestBody(card, startDate, endDate)
  ),
};

const requestPrivatBank = (url, requestInfo) => {
  const merchant = new PrivatBankApi(requestInfo);

  const requestBodyXmlFund = requestBody[url];
  const xmlBody = requestBodyXmlFund(merchant, requestInfo);

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
    return convered;
  });
};

module.exports = requestPrivatBank;
