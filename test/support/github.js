/**
Create a github client with test configuration options.
*/
function createClient() {
  var Github = require('github-api'),
      config = require('../../test_config').github;

  return new Github({ token: config.token });
}

module.exports = createClient;
