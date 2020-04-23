const requester = require('../requester');

const requestMonobank = (url, requestInfo) => {
  const { token } = requestInfo;

  const options = {
    uri: `https://api.monobank.ua${url}`,
    headers: {
      'X-Token': token,
    },
    json: true,
  };

  return requester(options);
};

module.exports = requestMonobank;
