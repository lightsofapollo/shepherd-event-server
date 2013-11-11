var Factory = require('object-factory'),
    config = require('../../test_config.json').github;

var GithubDetails = new Factory({
  properties: {
    user: '',
    repo: ''
  }
});

module.exports = new Factory({
  onbuild: function(props) {
    props.github = GithubDetails.create({
      user: config.junkyard_user,
      repo: config.junkyard_repo
    });
  },

  properties: {
    id: 1,

    url: 'https://github.com/' +
          config.junkyard_user +
          '/' + config.junkyard_repo + '.git',

    branch: 'master',

    name: config.junkyard_repo
  }
});
