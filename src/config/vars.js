const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
// eslint-disable-next-line object-curly-newline
const { cleanEnv, str, url, port } = require('envalid');

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: port(),
  MONGO_URI: url(),
});

module.exports = env;
