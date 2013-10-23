suite('support/pull_request', function() {
  var createPR = require('./pull_request');

  suite('pull request with files', function() {
    var pr;

    setup(function(done) {
      createPR({
        title: 'test pull request',
        files: [
          { commit: 'first', path: 'a.txt', content: 'woot' }
        ]
      }, function(err, _pr) {
        pr = _pr;
        done(err);
      });
    });

    teardown(function(done) {
      pr.destroy(function() {
        // ignore errors- if we fail to clean up because of the test its
        // no big deal and we verify deletion below.
        done();
      });
    });

    test('.branch exists', function(done) {
      assert.ok(pr.branch, 'has .branch');
      pr.repo.listBranches(function(err, list) {
        if (err) return done(err);
        assert.ok(
          list.indexOf(pr.branch) !== -1,
          list.join(', ') + ' has branch ' + pr.branch
        );
        done();
      });
    });

    test('.destroy', function(done) {
      pr.destroy(function(err) {
        if (err) return done(err);
        pr.repo.listBranches(function(err, list) {
          if (err) return done(err);
          assert.ok(
            list.indexOf(pr.branch) === -1,
            'removes pr'
          );
          done();
        });
      });
    });
  });
});
