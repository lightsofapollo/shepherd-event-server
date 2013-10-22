suite('routes/track', function() {
  var appFactory = require('../../');
  require('../support/db')();

  var createPull = require('../support/pull_request'),
      bz = require('../support/bz')(),
      bugFactory = require('../factory/bug'),
      request = require('supertest'),
      app,
      pullRequestFactory = require('../factory/pull_request'),
      eventFactory = require('../factory/pull_request_event'),
      consts = require('../../routes/track').consts;

  suite('error reponses', function() {
    setup(function() {
      app = appFactory();
    });

    test('invalid request - no body', function(done) {
      request(app).
        post('/track').
        send().
        expect(400, consts.INVALID_BODY).
        end(done);
    });

    test('request without +sheperd', function(done) {
      var fixture = {
        pull_request: pullRequestFactory({
          title: 'amazing cooking'
        })
      };

      request(app).
        post('/track').
        send(fixture).
        expect(200, consts.NOT_SHEPHERD).
        end(done);
    });

    test('+shepherd project not in db', function(done) {
      var fixture = {
        pull_request: pullRequestFactory({
          title: 'woot +shepherd'
        })
      };

      var app = appFactory();
      request(app).
        post('/track').
        send(fixture).
        expect(401, consts.NOT_TRACKED_REPO).
        end(done);
    });
  });

  suite('link opted pull request', function() {
    setup(function(done) {
      var config = require('../../test_config.json').github;

      app = appFactory();

      // insert a record to enable linking
      var document = {
        active: true,
        type: 'github',
        detail: {
          user: config.junkyard_user,
          repo: config.junkyard_repo
        }
      };

      var collection = app.get('db').collection('projects');

      collection.insert(
        document,
        done
      );
    });

    var bug = bugFactory({
      product: 'Testing',
      component: 'Marionette',
      summary: 'test bug!',
      version: 'unspecified',
      op_sys: 'All',
      priority: 'P1',
      platform: 'All'
    });

    var pullRequestData;
    var bugNumber;
    var pull;

    // create bug
    setup(function(done) {
      bz.createBug(bug, function(err, number) {
        bugNumber = number;
        done(err);
      });
    });

    // create pull request
    setup(function(done) {
      pullRequestData = {
        title: 'foo',
        files: [
          {
            commit: 'Bug ' + bugNumber + ' - do stuff',
            path: 'x.js',
            content: 'x'
          }
        ]
      };

      createPull(pullRequestData, function(err, _pull) {
        pull = _pull;
        done(err);
      });
    });

    teardown(function(done) {
      pull.destroy(done);
    });

    suite('successfully tracked', function() {
      var incomingPR, event;

      setup(function(done) {
        // create the event
        incomingPR = pullRequestFactory({
          title: 'yey +shepherd',
          number: pull.initial.number
        });
        event = eventFactory('opened', incomingPR);

        request(app).
          post('/track').
          set('Content-Type', 'application/json').
          send(event).
          expect(200).
          end(done);
      });

      test('creates attachment', function(done) {
        bz.bugAttachments(bugNumber, function(err, attachments) {
          console.log(attachments);
          done(err);
        });
      });
    });
  });
});
