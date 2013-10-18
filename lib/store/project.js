function Project(db) {
  this.collection = db.collection('projects');
}

Project.prototype = {
  /**
  Find the project from a given pull request.

  @see http://developer.github.com/v3/pulls/
  @param {Object} pr github pull request.
  @param {Function} callback [Error, Project].
  */
  findByPullRequest: function(pr, callback) {
    var baseRepo = pr && pr.base && pr.base.repo;

    if (!baseRepo) {
      return process.nextTick(function() {
        callback(new Error('invalid pull request .base.repo is missing'));
      });
    }

    var repo = baseRepo.name;
    var user = baseRepo.owner && baseRepo.owner.login;

    if (!user) {
      return process.nextTick(function() {
        callback(
          new Error('invalid pull request .base.repo.owner.login is missing')
        );
      });
    }

    function onFind(err, records) {
      if (err) return callback(err);
      callback(null, records[0]);
    }

    this.collection.
      find({ 'detail.user': user, 'detail.repo': repo }).
      limit(1).
      toArray(onFind);
  }
};

module.exports = Project;
