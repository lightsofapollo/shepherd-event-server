var PullRequest = require('github-fixtures/pull_request'),
    Repo = require('github-fixtures/repo');

module.exports = PullRequest.extend({
  onbuild: function(props) {
    var config = require('../../test_config').github;

    var repo = config.junkyard_repo;
    var user = config.junkyard_user;

    var repo = Repo.create({
      name: config.junkyard_repo,

      owner: {
        login: config.junkyard_user
      },

      clone_url: 'https://github.com/' +
                  config.junkyard_user +
                  '/' + config.junkyard_repo + '.git'
    });

    props.base.repo = repo;
  }
});
