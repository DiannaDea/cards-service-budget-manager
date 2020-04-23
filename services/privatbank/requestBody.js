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

const getStatementsRequestBody = (cardNum, startDate, endDate) => ({
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
          name: 'sd',
          value: startDate,
        },
      },
      {
        _attributes: {
          name: 'ed',
          value: endDate,
        },
      },
      {
        _attributes: {
          name: 'card',
          value: cardNum,
        },
      },
    ],
  },
});

module.exports = {
  getRequestBody,
  getBalanceRequestBody,
  getStatementsRequestBody,
};
