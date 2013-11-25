suite('project', function() {
  var Project = require('./github_project');
  // stage the db
  var testDB = require('../test/support/db')(),
      prFactory = require('../test/factory/pull_request'),
      projectFactory = require('../test/factory/project'),
      appFactory = require('../');

  var subject,
      db,
      github = require('../config')().github;

  setup(function() {
    db = appFactory().get('db');
    subject = new Project(db);
  });

  suite('#findByPullRequest', function() {

    test('cannot find pull request', function() {
      var pr = prFactory.create();
      return subject.findByPullRequest(pr).then(
        function(project) {
          assert.ok(!project, 'cannot find project');
        }
      );
    });

    suite('with a project', function() {
      var pr = prFactory.create();

      suite('right branch', function() {
        var project = projectFactory.create();
        setup(function(done) {
          db.collection('projects').insert(project, done);
        });

        test('finds record', function() {
          return subject.findByPullRequest(pr).then(function(record) {
            assert.ok(record, 'has record');
            assert.deepEqual(project.github, record.github);
          });
        });
      });

      suite('different branch', function() {
        var project = projectFactory.create({
          branch: 'stable'
        });

        setup(function(done) {
          db.collection('projects').insert(project, done);
        });

        test('does not find record', function() {
          return subject.findByPullRequest(pr).then(function(result) {
            assert.ok(!result, 'has no record');
          });
        });
      });
    });
  });
});

