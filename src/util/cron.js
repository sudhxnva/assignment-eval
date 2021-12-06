const { CronJob } = require('cron');
const log = require('../config/logger');

// Job runs every minute
const job = new CronJob('0 */1 * * * *', () => {
  log.info('Checking for assignments...');
});

job.start();
