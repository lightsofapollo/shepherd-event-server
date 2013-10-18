/**
@param {Object} options for factory.
@param {String} options.user user.login.
@param {String} options.repo repo name.
@param {String} options.title title for pr.
@param {Number} options.number pr number.
*/
function factory(options) {
  return {
    number: options.number || 1,
    state: 'open',
    title: options.title || 'title',
    head: {},
    base: {
      repo: {
        name: options.repo,
        owner: {
          login: options.user
        }
      }
    }
  };
}

module.exports = factory;
