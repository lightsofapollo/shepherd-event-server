/*
XXX

After internally debating how this should work I think the "track" step
should be its own isolated concept (it applies elsewhere) and what is tracked
is a particular landing revision & attachment/source.
*/
var linkify = require('task-linkify'),
    Project = require('../lib/store/project');

/**
Handle incoming github events and create links.
*/
function track(req, res) {
  var app = req.app;
  var project = new Project(app.get('db'));

  if (!req.body || !req.body.pull_request) {
    console.log('invalid hook response no .pull_request');
    return res.send(400);
  }

  var pull = req.body.pull_request;

  // if the pull request has not opted for shepherd abort
  if (pull.title.indexOf('+shepherd') === -1) {
    console.log(pull.title + 'is not +shepherd');
    res.send(200);
    return;
  }

  project.findByPullRequest(pull, function(err, project) {
    if (err) {
      console.log('db error %s', err.message);
      return res.send(400);
    }

    if (!project) {
      console.log('cannot find project');
      return res.send(401);
    }

    var linkReq = {
      bugzillaConfig: app.get('bugzilla'),
      oauthToken: app.get('github').token,
      user: project.detail.user,
      repo: project.detail.repo,
      number: pull.number
    };

    linkify(linkReq, function(err) {
      if (err) return res.send(500);
      return res.send(200);
    });
  });
}

module.exports = track;
