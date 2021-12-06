const { default: axios } = require('axios');
const util = require('util');
const stream = require('stream');
const fs = require('fs');
const { TOKEN } = require('../config/vars');
const log = require('../config/logger');

const pipeline = util.promisify(stream.pipeline);

axios.defaults.baseURL = 'https://graph.microsoft.com/v1.0';
axios.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const downloadFile = async (url, path) => {
  try {
    const file = fs.createWriteStream(path);

    file.on('open', async () => {
      const request = await axios.get(url, {
        responseType: 'stream',
      });
      await pipeline(request.data, file);
    });

    log.info('File downloaded');
    return true;
  } catch (error) {
    log.error('File download failed', error);
    return false;
  }
};

module.exports = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  downloadFile,
};
