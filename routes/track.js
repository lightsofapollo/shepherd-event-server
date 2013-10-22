/*
XXX

After internally debating how this should work I think the "track" step
should be its own isolated concept (it applies elsewhere) and what is tracked
is a particular landing revision & attachment/source.
*/
var linkify = require('task-linkify'),
    Project = require('../lib/store/project');

var consts = {
  INVALID_BODY: { message: 'body must be json and contain .pull_request' },
  NOT_SHEPHERD: { message: 'valid pull request but not +shepherd skipping' },
  NOT_TRACKED_REPO: { message: 'shepherd does not manage this repo' },
  UNKNOWN_DB_ERROR: { message: 'end of days! unknown db error' },
  LINKIFY_ERROR: { message: 'error linking pull request to bug' }
};

/**
Handle incoming github events and create links.
*/
function track(req, res) {
  var app = req.app;
  var project = new Project(app.get('db'));

  if (!req.body || !req.body.pull_request) {
    console.log('invalid hook response no .pull_request');
    return res.send(400, consts.INVALID_BODY);
  }

  var pull = req.body.pull_request;

  // if the pull request has not opted for shepherd abort
  if (pull.title.indexOf('+shepherd') === -1) {
    console.log(pull.title + 'is not +shepherd');
    // maybe this should be something other than 200 but we need to send
    // something in that range so github keeps issuing requests.
    res.send(200, consts.NOT_SHEPHERD);
    return;
  }

  project.findByPullRequest(pull, function(err, project) {
    if (err) {
      console.log('db error %s', err.message);
      return res.send(400, consts.UNKNOWN_DB_ERROR);
    }

    if (!project) {
      console.log('cannot find project');
      return res.send(401, consts.NOT_TRACKED_REPO);
    }

    var linkReq = {
      bugzillaConfig: app.get('bugzilla'),
      oauthToken: app.get('github').token,
      user: project.detail.user,
      repo: project.detail.repo,
      number: pull.number
    };

    linkify(linkReq, function(err) {
      if (err) return res.send(500, consts.LINKIFY_ERROR);
      return res.send(200);
    });
  });
}

track.consts = consts;
module.exports = track;
