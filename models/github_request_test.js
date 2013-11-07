suite('models/github_request', function() {
  var PullRequest = require('../test/factory/pull_request'),
      Project = require('../test/factory/project'),
      Request = require('./request'),
      Model = require('./github_request');


  suite('#create', function() {
    var pr = PullRequest.create();
    var project = Project.create();

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
});
