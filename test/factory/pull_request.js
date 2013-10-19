/**
@param {Object} options for factory.
@param {String} options.user user.login.
@param {String} options.repo repo name.
@param {String} options.title title for pr.
@param {Number} options.number pr number.
*/
function factory(options) {
  var testConfig = require('../../test_config.json').github;

  return {
    number: options.number || 1,
    state: 'open',
    title: options.title || 'title',
    head: {},
    base: {
      repo: {
        name: options.repo || testConfig.junkyard_repo,
        owner: {
          login: options.user || testConfig.junkyard_user
        }
      }
    }
  };
}

module.exports = factory;
