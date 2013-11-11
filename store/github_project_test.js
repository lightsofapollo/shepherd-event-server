suite('project', function() {
  var Project = require('./project');
  // stage the db
  var testDB = require('../../test/support/db')(),
      prFactory = require('../../test/factory/pull_request'),
      projectFactory = require('../../test/factory/project'),
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

    suite('with a project', function() {
      var pr = prFactory.create();
      var project = projectFactory.create();

      setup(function(done) {
        db.collection('projects').insert(project, done);
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
