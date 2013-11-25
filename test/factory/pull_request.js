var PullRequest = require('github-fixtures/pull_request'),
    Repo = require('github-fixtures/repo');

module.exports = PullRequest.extend({
  onbuild: function(props) {
    var config = require('../../config')().github;

    var repo = config.repo;
    var user = config.user;

    var repo = Repo.create({
      name: config.repo,

      owner: {
        login: config.user
      },

      clone_url: 'https://github.com/' +
                  config.user +
                  '/' + config.repo + '.git'
    });

    props.base.repo = repo;
  }
});
