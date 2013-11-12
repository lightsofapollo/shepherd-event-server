suite('store/github_request', function() {
  var Request = require('./github_request');
  // stage the db
  var testDB = require('../test/support/db')(),
      prFactory = require('../test/factory/pull_request'),
      projectFactory = require('../test/factory/project'),
      requestFactory = require('../test/factory/github_request'),
      appFactory = require('../');

  var subject,
      db,
      github = require('../test_config.json').github,
      project;

  setup(function() {
    db = appFactory().get('db');
    subject = new Request(db);
  });

  var project = projectFactory.create({
    _id: 'woootsomeid'
  });

  suite('#findByProjectAndPullNumber', function() {
    var request = requestFactory.create({
      projectId: project._id
    });

    setup(function(done) {
      subject.collection.insert(request, done);
    });

    test('with correct project and number', function(done) {
      subject.findByProjectAndPullNumber(
        project,
        request.github.number,
        function(err, record) {
          if (err) return done(err);
          assert(record, 'finds record');
          assert.equal(record.projectId, project._id, 'project id');
          assert.equal(record.github.number, request.github.number, '.number');
          done();
        }
      );
    });

    test('with unknown pull request number', function(done) {
      subject.findByProjectAndPullNumber(
        project,
        1000000000,
        function(err, record) {
          assert.ok(!record, 'has no record');
          done(err);
        }
      );
    });

    test('invalid number', function(done) {
      subject.findByProjectAndPullNumber(
        project,
        null,
        function(err, record) {
          assert.ok(err);
          assert.ok(err.message.indexOf('.number'));
          done();
        }
      );
    });

    test('invalid project', function(done) {
      subject.findByProjectAndPullNumber(
        {},
        1,
        function(err, record) {
          assert.ok(err);
          assert.ok(err.message.indexOf('.project'));
          done();
        }
      );
    });
  });
});
