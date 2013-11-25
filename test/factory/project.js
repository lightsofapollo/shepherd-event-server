var Factory = require('object-factory'),
    config = require('../../config')().github;

var GithubDetails = new Factory({
  properties: {
    user: '',
    repo: ''
  }
});

module.exports = new Factory({
  onbuild: function(props) {
    props.github = GithubDetails.create({
      user: config.user,
      repo: config.repo
    });
  },

  properties: {
    url: 'https://github.com/' +
          config.user +
          '/' + config.repo + '.git',

    branch: 'master',

    name: config.repo
  }
});
