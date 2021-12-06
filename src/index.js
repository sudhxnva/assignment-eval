// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { PORT, NODE_ENV } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
require('./util/cron');

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(PORT, () => logger.info(`Running on port ${PORT} (${NODE_ENV})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
