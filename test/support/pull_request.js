var Promise = require('Promise');

var uuid = require('uuid'),
    debug = require('debug')('shepherd-event-sever:test:pull_request');

/**
Github object representation.
*/
function PullRequest() {}

PullRequest.prototype = {
  /**
  branch where pull request comes from.
  @type String
  */
  branch: null,

  /**
  Repo representation.
  See: https://github.com/michael/github#repository-api
  @type GithubAPI.Repo
  */
  repo: null,

  sourceRepoBranches: function() {
    var list = Promise.denodeify(this.repo.listBranches.bind(this.repo));
    return list();
  },

  /**
  Delete branch on github.
  */
  destroy: function(callback) {
    var deleteRef = Promise.denodeify(this.repo.deleteRef.bind(this.repo));
    return deleteRef('heads/' + this.branch);
  }
};

/**
create a pull request over the github api and create the abstract object.

    create({
      title: 'magic pull request +shepherd',
      files: [
        { commit: 'xfoo', path: 'path.js', content: 'wow!' }
      ]
    }).then(pr)
      // do stuff with pr
    });

@param {Object} options for pull request.
@param {Array[Object]} options.files files in the pull request.
@param {String} options.title for pull request.
*/
function create(options) {
  // verify we are given options
  if (!options.files || !options.files.length) {
    throw new Error('.files must be given and be an array');
  }

  debug('create pr', options);

  var config = require('../../test_config').github;
  // github client with test config.
  var github = require('./github')();
  // repo where we put test subjects.
  var junkyard =
    github.getRepo(config.junkyard_user, config.junkyard_repo);

  // create the branch name
  var pullObject = new PullRequest();

  pullObject.branch = 'branch-' + uuid();
  pullObject.repo = junkyard;

  function createFiles() {
    var write = Promise.denodeify(junkyard.write.bind(junkyard));

    var promises = options.files.map(function(file) {
      return write(pullObject.branch, file.path, file.content, file.commit);
    });

    return Promise.all(promises);
  }

  function createPullRequest() {
    var createPullRequest = Promise.denodeify(
      junkyard.createPullRequest.bind(junkyard)
    );

    return createPullRequest({
      title: options.title,
      body: options.title,
      base: 'master',
      head: pullObject.branch
    }).then(
      function(pr) {
        pullObject.initial = pr;
        return pullObject;
      }
    );
  }

  var createBranch = Promise.denodeify(junkyard.branch.bind(junkyard));

  return createBranch('master', pullObject.branch).then(
    createFiles
  ).then(
    createPullRequest
  );
}

module.exports = create;
