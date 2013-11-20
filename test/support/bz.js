function createClient() {
  var config = require('../../test_config').bugzilla,
      bzAPI = require('bz');

  return bzAPI.createClient(config);
}

module.exports = createClient;
