/**
Test environment abstraction... Deals with specifics for the local setup and the
CI setup.
*/

var fs = require('fs');

// location for test_config.json
var CONFIG = './test_config.json';

function main() {
  if (fs.existsSync(CONFIG)) return require(CONFIG);

  function env(name) {
    if (!process.env[name]) {
      console.error(
        'Invalid test setup missing environment variable "%s"',
        name
      );
    }
    return process.env[name];
  }

  console.log(process.env);

  // build test configuration from environment variables
  return {
    github: {
      token: env('GITHUB_TOKEN'),
      junkyard_repo: env('GITHUB_REPO'),
      junkyard_user: env('GITHUB_USER')
    },
    bugzilla: {
      username: env('BUGZILLA_USERNAME'),
      password: env('BUGZILLA_PASSWORD'),
      url: env('BUGZILLA_URL')
    }
  };
}

module.exports = main();
