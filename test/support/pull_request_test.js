suite('support/pull_request', function() {
  var createPR = require('./pull_request');
  var Promise = require('promise');

  suite('pull request with files', function() {
    var pr;

    setup(function(done) {
      return createPR({
        title: 'test pull request',
        files: [
          { commit: 'first', path: 'a.txt', content: 'woot' }
        ]
      }).then(function(_pr) {
        pr = _pr;
      }, function(err) {
        console.log(err);
        done(err);
      });
    });

    teardown(function(done) {
      var alwaysDone = done.bind(null, null);
      pr.destroy().then(alwaysDone, alwaysDone);
    });

    test('.branch exists', function(done) {
      assert.ok(pr.branch, 'has .branch');
      return pr.sourceRepoBranches().then(function(list) {
        assert.ok(
          list.indexOf(pr.branch) !== -1,
          list.join(', ') + ' has branch ' + pr.branch
        );
      });
    });

    test('.destroy', function(done) {
      return pr.destroy().then(
        pr.sourceRepoBranches.bind(pr)
      ).then(function(list) {
        assert.ok(
          list.indexOf(pr.branch) === -1,
          'removes pr'
        );
      });
    });
  });
});
