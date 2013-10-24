suite('index', function() {
  var subject = require('../');
  var mongoskin = require('mongoskin');

  function setEnvs(envs) {
    var original = {};
    for (var key in process.env) original[key] = process.env[key];

    setup(function() {
      // override keys
      for (var key in envs) process.env[key] = envs[key];
    });

    teardown(function() {
      for (var key in original) process.env[key] = original[key];
    });
  }

  test('default connection to mongo', function(done) {
    var app = subject(),
        db = app.get('db');

    assert.ok(db, 'has db');
    assert.ok(db.collection, 'is a mongodb');

    db.close(done);
  });

  suite('environment variable specified mongodb', function() {
    var url = 'mongodb://localhost/test_custom';
    setEnvs({ MONGOLAB_URI: url });

    test('sets the mongodb url', function(done) {
      var app = subject(),
          db = app.get('db');

      db.open(function(err) {
        if (err) return done(err);
        // internal db is the native driver
        var name = db.db.databaseName;
        assert.equal(name, 'test_custom');
        db.close(done);
      });
    });
  });
});
