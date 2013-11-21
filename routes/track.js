var Promise = require('promise');

/*
XXX

After internally debating how this should work I think the "track" step
should be its own isolated concept (it applies elsewhere) and what is tracked
is a particular landing revision & attachment/source.
*/
var linkify = Promise.denodeify(require('task-linkify')),
    Project = require('../store/github_project');

var consts = {
  INVALID_BODY: { message: 'body must be json and contain .pull_request' },
  NOT_SHEPHERD: { message: 'valid pull request but not +shepherd skipping' },
  NOT_TRACKED_REPO:
    { code: 401, message: 'shepherd does not manage this repo' },
  LINKIFY_ERROR: { message: 'error linking pull request to bug' }
};

function linkProject(app, pull, project) {
  var linkReq = {
    bugzillaConfig: app.get('bugzilla'),
    oauthToken: app.get('github').token,
    user: project.github.user,
    repo: project.github.repo,
    number: pull.number
  };

  return linkify(linkReq);
}

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
    console.log(pull.title + ' is NOT +shepherd, IGNORING');
    // maybe this should be something other than 200 but we need to send
    // something in that range so github keeps issuing requests.
    res.send(200, consts.NOT_SHEPHERD);
    return;
  }

  function validateProject(project) {
    return new Promise(function(accept, reject) {
      if (!project) return reject(consts.NOT_TRACKED_REPO);
      accept(project);
    });
  }

  project.findByPullRequest(pull).then(
    validateProject
  ).then(
    linkProject.bind(this, app, pull)
  ).then(
    res.send.bind(res, 200),
    function(err) {
      if (err instanceof Error) {
        console.error('Unexpected error', err);
        return res.send(500, err.message);
      }

      console.error('Unsuccessful request', err);
      var code = err.code || 500;
      res.send(code, err.message);
    }
  );
}

track.consts = consts;
module.exports = track;
