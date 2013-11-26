var Promise = require('promise');

function Project(db) {
  this.collection = db.collection('projects');
}

Project.prototype = {
  /**
  Find the project from a given pull request.

  @see http://developer.github.com/v3/pulls/
  @param {Object} pr github pull request.
  @return Promise
  */
  findByPullRequest: function(pr) {
    return new Promise(function(accept, reject) {
      var base = pr && pr.base,
          baseRepo = base && base.repo;

      if (!baseRepo) {
        return reject(new Error('invalid pull request .base.repo is missing'));
      }

      var repo = baseRepo.name,
          user = baseRepo.owner && baseRepo.owner.login,
          branch = base.label;

      if (!user) {
        return reject(
          new Error('invalid pull request .base.repo.owner.login is missing')
        );
      }

      if (!branch) {
        return reject(new Error('base branch not found'));
      }

      function onFind(err, records) {
        if (err) return reject(err);
        accept(records[0]);
      }

      this.collection.
        find({
          branch: branch,
          'github.user': user,
          'github.repo': repo
        }).
        limit(1).
        toArray(onFind);

    }.bind(this));
  }
};

module.exports = Project;
