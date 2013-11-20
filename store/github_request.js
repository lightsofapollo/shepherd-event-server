var Promise = require('promise');

/**
Object storage abstraction on top of mongodb for "requests" to merge a github
pull request.
*/

function GithubRequest(db) {
  this.collection = db.collection('requests');
}

GithubRequest.prototype = {
  /**
  @param {Object} project which this request belongs to.
  @param {Number} number of the pull request.
  @param {Function} callback [Error, Request]
  */
  findByProjectAndPullNumber: function(project, number, callback) {
    return new Promise(function(accept, reject) {
      var projectId = project._id;

      // intentional == means undefined or null
      if (projectId == null) {
        return reject(
          new Error('project._id passed is null or undefined')
        );
      }

      if (number == null) {
        return reject(
          new Error('github pull request number must be passed')
        );
      }

      function onFind(err, item) {
        if (err) reject(err);
        accept(item && item[0]);
      }

      this.collection.
        find({
           projectId: projectId,
           'github.number': number
        }).
        limit(1).
        toArray(onFind);

    }.bind(this));
  }
};

module.exports = GithubRequest;
