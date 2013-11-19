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
    var base = pr && pr.base,
        baseRepo = base && base.repo;

    if (!baseRepo) {
      return process.nextTick(function() {
        callback(new Error('invalid pull request .base.repo is missing'));
      });
    }

    var repo = baseRepo.name,
        user = baseRepo.owner && baseRepo.owner.login,
        branch = base.label;

    if (!user) {
      return process.nextTick(function() {
        callback(
          new Error('invalid pull request .base.repo.owner.login is missing')
        );
      });
    }

    if (!branch) {
      return process.nextTick(function() {
        callback(new Error('base branch not found'));
      });
    }

    function onFind(err, records) {
      if (err) return callback(err);
      callback(null, records[0]);
    }

    this.collection.
      find({
        branch: branch,
        'github.user': user,
        'github.repo': repo
      }).
      limit(1).
      toArray(onFind);
  }
};

module.exports = Project;
