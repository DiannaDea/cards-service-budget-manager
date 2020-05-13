const Koa = require('koa');
const respond = require('koa-respond');
const logger = require('koa-logger');
const cors = require('@koa/cors');

const { routes } = require('../routes');
const runCron = require('../services/cron');

require('../db/connection');

const app = new Koa();

runCron();

app.use(cors());
app.use(respond());
app.use(logger());

routes.forEach((route) => app.use(route));

module.exports = app;
