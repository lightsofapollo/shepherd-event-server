suite('routes/init', function() {
  var app = require('../../'),
      request = require('supertest'),
      config = require('../../config.json'),
      exec = require('child_process').exec;

  // stage the db
  var testDB = require('../support/db')();

  function initDB() {
    setup(function(done) {
      exec(
        [
          __dirname + '/../../bin/db_init',
          testDB
        ].join(' '),
        function(err, stdout, stderr) {
          done();
        }
      );
    });
  }

  var db, app;
  setup(function() {
    app = require('../../')();
    db = app.get('db');
  });

  teardown(function(done) {
    db.close(done);
  });

  test('no projects are present', function(done) {
    var db = app.get('db');

    db.collection('projects').count(function(err, num) {
      if (err) return done();
      assert.equal(num, 0);
      done();
    });
  });

  suite('preload db', function() {
    initDB();

    var records;
    setup(function(done) {
      db.collection('projects').find().toArray(function(err, projects) {
        records = projects;
        done(err);
      });
    });

    test('has default project', function() {
      var fixtures = require('../../data/init.json').projects;
      assert.ok(records.length !== 0, 'has records');
      assert.equal(records.length, fixtures.length);

      var dbRecord = records[0];
      delete dbRecord._id;

      assert.deepEqual(fixtures[0], dbRecord, 'contains fixture details');
    });

    suite('will only load if db is empty', function() {
      initDB();

      test('db only has one record', function(done) {
        db.collection('projects').count(function(err, len) {
          assert.equal(len, 1);
          done(err);
        });
      });
    });
  });
});
