suite('routes/track', function() {
  var appFactory = require('../');
  require('../test/support/db')();

  var createPull = require('../test/support/pull_request'),
      bz = require('../test/support/bz')(),
      bugFactory = require('../test/factory/bug'),
      pullRequestFactory = require('../test/factory/pull_request'),
      eventFactory = require('../test/factory/pull_request_event'),
      projectFactory = require('../test/factory/project'),
      request = require('supertest'),
      consts = require('./track').consts,
      app;

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
        pull_request: pullRequestFactory.create({
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
        pull_request: pullRequestFactory.create({
          title: 'woot +shepherd'
        })
      };

      var app = appFactory();
      request(app).
        post('/track').
        send(fixture).
        expect(401, consts.NOT_TRACKED_REPO.message).
        end(done);
    });
  });

  suite('link opted pull request', function() {
    setup(function(done) {
      var config = require('../test_config').github;
      app = appFactory();

      var collection = app.get('db').collection('projects');

      // insert a record to enable linking
      collection.insert(
        projectFactory.create(),
        done
      );
    });

    var bug = bugFactory.create({
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

      return createPull(pullRequestData).then(
        function(_pull) {
          pull = _pull;
        }
      );
    });

    teardown(function(done) {
      return pull.destroy();
    });

    suite('successfully tracked', function() {
      var incomingPR, event;

      setup(function(done) {
        // create the event
        incomingPR = pullRequestFactory.create({
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
          if (err) return done(err);
          assert(attachments.length, 'has attachments')
          var attachment = attachments[0];
          var url = new Buffer(attachment.data, 'base64').toString();
          assert.ok(
            url.indexOf('pull/' + pull.initial.number) !== -1,
            'pull request is referenced'
          );
          done();
        });
      });
    });
  });
});
