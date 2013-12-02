function createClient() {
  var config = require('../../config')('bugzilla');
      bzAPI = require('bz');

  return bzAPI.createClient(config);
}

module.exports = createClient;
