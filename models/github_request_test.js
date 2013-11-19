suite('models/github_request', function() {
  var PullRequest = require('../test/factory/pull_request'),
      Project = require('../test/factory/project'),
      Request = require('./request'),
      Model = require('./github_request');


  var project = Project.create(),
      pr = PullRequest.create();

  suite('#create', function() {

    var subject;

    setup(function() {
      subject = Model.create(project, pr);
    });

    test('.type', function() {
      assert.equal(subject.type, 'github');
    });

    test('.projectId', function() {
      assert.equal(subject.projectId, project._id);
    });

    test('.state', function() {
      assert.equal(Request.states.NEW, subject.state);
    });

    test('.github', function() {
      assert.deepEqual(subject.github, {
        number: pr.number
      });
    });
  });

  suite('#checkForErrors', function() {
    test('invalid pull request', function() {
      var subject = Model.create(project, {});
      var error = Model.checkForErrors(subject);

      assert.ok(error.message.indexOf('.number') !== -1);
    });

    test('invalid projectId', function() {
      var subject = Model.create({}, pr);
      var error = Model.checkForErrors(subject);

      assert.ok(error.message.indexOf('.projectId') !== -1);
    });
  });
});
