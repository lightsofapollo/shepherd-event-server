var Factory = require('object-factory'),
    config = require('../../test_config.json').github;

module.exports = new Factory({
  properties: {
    id: 1,

    url: 'https://github.com/' +
          config.junkyard_user +
          '/' + config.junkyard_repo + '.git',

    branch: 'master',

    name: config.junkyard_repo
  }
});
