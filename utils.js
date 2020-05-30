const querystring = require('querystring');
const requester = require('./services/requester');

const getGroups = (queryParams) => {
  const params = querystring.stringify(queryParams);
  const options = {
    uri: `http://35.234.97.137:7000/api/users-service/groups?${params}`,
    json: true,
  };

  return requester(options);
};

module.exports = {
  getGroups,
};
