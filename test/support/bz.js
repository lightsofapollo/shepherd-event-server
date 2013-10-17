function createClient() {
  var config = require('../../test_config.json').bugzilla,
      bzAPI = require('bz');

  return bzAPI.createClient(config);
}

module.exports = createClient;
