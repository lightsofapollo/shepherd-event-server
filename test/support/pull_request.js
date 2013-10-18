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

  /**
  Delete branch on github.
  */
  destroy: function(callback) {
    this.repo.deleteRef('heads/' + this.branch, callback);
  }
};

/**
create a pull request over the github api and create the abstract object.

    create({
      title: 'magic pull request +shepherd',
      files: [
        { commit: 'xfoo', path: 'path.js', content: 'wow!' }
      ]
    }, function(err, pr) {
    });

@param {Object} options for pull request.
@param {Array[Object]} options.files files in the pull request.
@param {String} options.title for pull request.
*/
function create(options, callback) {

  // verify we are given options
  if (!options.files || !options.files.length) {
    throw new Error('.files must be given and be an array');
  }

  debug('create pr', options);

  var config = require('../../test_config.json').github;
  // github client with test config.
  var github = require('./github')();
  // repo where we put test subjects.
  var junkyard =
    github.getRepo(config.junkyard_username, config.junkyard_repo);

  // create the branch name
  var pullObject = new PullRequest();

  pullObject.branch = 'branch-' + uuid();
  pullObject.repo = junkyard;

  function createFiles() {
    var pending = options.files.length;

    function next(err) {
      if (err) {
        // we run in parallel for speed but only report the first error.
        callback && callback(err);
        // ensure we only fire the callback once.
        callback = null;
        return;
      }

      if (--pending === 0) createPullRequest();
    }

    options.files.forEach(function(file) {
      junkyard.write(
        pullObject.branch, file.path, file.content, file.commit, next
      );
    });
  }

  function createPullRequest() {
    var createRequest = {
      title: options.title,
      body: options.title,
      base: 'master',
      head: pullObject.branch
    };

    junkyard.createPullRequest(createRequest, function(err, pr) {
      if (err) return callback(err);
      // record initial pull request state
      pullObject.initial = pr;
      callback(null, pullObject);
    });
  }

  // create the branch! (its always master as root for now)
  junkyard.branch('master', pullObject.branch, function(err, result) {
    if (err) return callback(err);
    createFiles();
  });
}

module.exports = create;
