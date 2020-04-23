const crypto = require('crypto');
const convert = require('xml-js');

const {
  getRequestBody,
  getBalanceRequestBody,
  getStatementsRequestBody,
} = require('./requestBody');

class PrivatBankApi {
  constructor({ merchantId, password, country }) {
    this.merchantId = merchantId;
    this.password = password;
    this.country = country;
  }

  static generateSignature(data, password) {
    const hash = crypto.createHash('md5');
    hash.update(`${data}${password}`);

    const signature = crypto.createHash('sha1');
    signature.update(hash.digest('hex'));

    return signature.digest('hex');
  }

  createRequestBody(data) {
    const dataXml = convert.js2xml(data, { compact: true });

    const signature = PrivatBankApi.generateSignature(dataXml, this.password);

    const requestBody = getRequestBody(this.merchantId, signature, data);
    return convert.js2xml(requestBody, { compact: true });
  }

  createBalanceRequestBody(card) {
    const balanceRequestBody = getBalanceRequestBody(card);
    return this.createRequestBody(balanceRequestBody);
  }

  createStatementsRequestBody(card, startDate, endDate) {
    const statementsRequestBody = getStatementsRequestBody(card, startDate, endDate);
    return this.createRequestBody(statementsRequestBody);
  }

  static convertBodyToJson(body) {
    return convert.xml2json(body, { compact: true });
  }
}

module.exports = PrivatBankApi;
