const rp = require('request-promise');
const logger = require('./logger');

const requester = (options) => {
  try {
    const response = rp(options);
    return response;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = requester;
