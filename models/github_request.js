var Request = require('./request');

var GithubRequest = {
  /**
  Create a request from a project and pull_request record.

  @param {Object} project for request.
  @param {Object} pullRequest object from github.
  */
  create: function(project, pullRequest) {
    return {
      projectId: project._id,
      state: Request.states.NEW,
      type: 'github',
      github: { number: pullRequest.number }
    };
  },

  /**
  validates the contents of a github request.

  @param {Object} request to validate.
  @return {Null|Error} null in the case of success an error object otherwise.
  */
  checkForErrors: function(request) {
    if (!request.github || !request.github.number) {
      return new Error('invalid .github.number');
    }

    if (!request.projectId) {
      return new Error('invalid .projectId');
    }
  }
};

module.exports = GithubRequest;
