/* eslint-disable class-methods-use-this */
const crypto = require('crypto');
const moment = require('moment');
const convert = require('xml-js');

const request = require('./request');

const DATE_FORMAT = 'DD.MM.YYYY';

const DATE_RANGE = {
  today: () => moment().format(DATE_FORMAT),
  monthAgo: () => moment().subtract(1, 'month').format(DATE_FORMAT),
};

const getRequestBody = (merchantId, signature, data) => ({
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: 'UTF-8',
    },
  },
  request: {
    _attributes: {
      version: '1.0',
    },
    merchant: {
      id: {
        _text: merchantId,
      },
      signature: {
        _text: signature,
      },
    },
    data,
  },
});

const getBalanceRequestBody = (cardNum) => ({
  oper: {
    _text: 'cmt',
  },
  wait: {
    _text: '0',
  },
  test: {
    _text: '0',
  },
  payment: {
    _attributes: {
      id: '',
    },
    prop: [
      {
        _attributes: {
          name: 'cardnum',
          value: cardNum,
        },
      },
      {
        _attributes: {
          name: 'country',
          value: 'UA',
        },
      },
    ],
  },
});

class Merchant {
  constructor({ merchantId, password, country }) {
    this.merchantId = merchantId;
    this.password = password;
    this.country = country;
  }

  generateSignature(data) {
    const hash = crypto.createHash('md5');
    hash.update(`${data}${this.password}`);

    const signature = crypto.createHash('sha1');
    signature.update(hash.digest('hex'));

    return signature.digest('hex');
  }

  requestPrivatBank(url, data) {
    const dataXml = convert.js2xml(data, { compact: true });

    const signature = this.generateSignature(dataXml);

    const requestBody = getRequestBody(this.merchantId, signature, data);
    const requestBodyXml = convert.js2xml(requestBody, { compact: true });

    return request.post(`https://api.privatbank.ua/p24api${url}`, requestBodyXml)
      .then((response) => convert.xml2json(response.data, { compact: true }));
  }

  balance(card) {
    const balanceRequestBody = getBalanceRequestBody(card);
    return this.requestPrivatBank('/balance', balanceRequestBody);
  }

  // statement(card = this.card, startDate = DATE_RANGE.monthAgo(), endDate = DATE_RANGE.today()) {
  //   card = card || required('Card number');

  //   const data = `<oper>cmt</oper>
  //           <wait>90</wait>
  //           <test>0</test>
  //           <payment id="">
  //               <prop name="sd" value="${startDate}"/>
  //               <prop name="ed" value="${endDate}"/>
  //               <prop name="cardnum" value="${card}"/>
  //               <prop name="country" value="${this.country}" />
  //           </payment>`;

  //   return this.requestPrivatBank('/rest_fiz', data);
  // }
}

module.exports = Merchant;
