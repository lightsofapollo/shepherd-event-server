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
    var projectId = project._id;

    // intentional == means undefined or null
    if (projectId == null) {
      return process.nextTick(callback.bind(this, new Error(
        'project._id passed is null or undefined'
      )));
    }

    if (number == null) {
      return process.nextTick(callback.bind(this, new Error(
        'github pull request number must be passed'
      )));
    }

    function onFind(err, item) {
      callback(err, item && item[0]);
    }

    this.collection.
      find({
         projectId: projectId,
         'github.number': number
      }).
      limit(1).
      toArray(onFind);
  }
};

module.exports = GithubRequest;
