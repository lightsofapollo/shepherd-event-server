suite('project', function() {
  var Project = require('../../../lib/store/project');
  // stage the db
  var testDB = require('../../support/db')(),
      prFactory = require('../../factory/pull_request'),
      appFactory = require('../../../');

  var subject,
      db;
  setup(function() {
    db = appFactory().get('db');
    subject = new Project(db);
  });

  suite('#findByPullRequest', function() {
    test('cannot find pull request', function(done) {
      var pr = prFactory({ repo: 'repo', user: 'user' });
      subject.findByPullRequest(pr, function(err, project) {
        assert.ok(!project, 'cannot find project');
        done(err);
      });
    });

    suite('success', function() {
      var pr = prFactory({ repo: 'repo', user: 'user' });

      var document = {
        type: 'github',
        active: true,
        detail: { user: 'user', repo: 'repo' }
      };

      setup(function(done) {
        db.collection('projects').insert({
          type: 'github',
          active: true,
          detail: { user: 'user', repo: 'repo' }
        }, done);
      });

      test('finds record', function(done) {
        subject.findByPullRequest(pr, function(err, record) {
          assert.ok(record, 'has record');
          assert.deepEqual(document.detail, record.detail);
          done(err);
        });
      });
    });
  });


});
