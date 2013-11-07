suite('project', function() {
  var Project = require('./project');
  // stage the db
  var testDB = require('../../test/support/db')(),
      prFactory = require('../../test/factory/pull_request'),
      appFactory = require('../../');

  var subject,
      db,
      github = require('../../test_config.json').github;

  setup(function() {
    db = appFactory().get('db');
    subject = new Project(db);
  });

  suite('#findByPullRequest', function() {
    test('cannot find pull request', function(done) {
      var pr = prFactory.create();
      subject.findByPullRequest(pr, function(err, project) {
        assert.ok(!project, 'cannot find project');
        done(err);
      });
    });

    suite('success', function() {
      var pr = prFactory.create();

      var document = {
        type: 'github',
        active: true,
        detail: {
          user: github.junkyard_user,
          repo: github.junkyard_repo
        }
      };

      setup(function(done) {
        db.collection('projects').insert({
          type: 'github',
          active: true,
          detail: {
            user: github.junkyard_user,
            repo: github.junkyard_repo
          }
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
