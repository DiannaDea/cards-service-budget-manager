const Sequelize = require('sequelize');
const config = require('config');
const logger = require('../services/logger');

const {
  db: {
    host, port, name, user, password,
  },
} = config;

const sequelize = new Sequelize(name, user, password, {
  host,
  port,
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
