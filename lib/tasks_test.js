suite('tasks', function() {
  var Tasks = require('./tasks'),
      config = require('../config');

  var tasks = {
    noop: {
      module: __dirname + '/../test/noop_task',
      timeout: 100
    },
    noop_options: {
      module: __dirname + '/../test/noop_task',
      configKeys: ['bugzilla', 'mongodb'],
      timeout: 100
    },

    noop_timesout: {
      module: __dirname + '/../test/noop_task',
      timeout: 250
    }
  };

  suite('constructor', function() {
    test('missing module', function() {
      assert.throws(function() {
        new Tasks({
          invalid: { timeout: 111 },
          valid: { module: '...xxx', timeout: 111 }
        });
      }, /module/);
    });

    test('missing timeout', function() {
      assert.throws(function() {
        new Tasks({
          valid: { module: '...xxx', timeout: 111 },
          invalid: { module: '...xxx' }
        });
      }, /timeout/);
    });
  });

  suite('.run', function() {
    var subject;
    setup(function() {
      subject = new Tasks(tasks);
    });


    test('not available module', function(done) {
      subject.run('ihaznoname', {}).then(null, function(err) {
        assert.ok(err);
        done();
      });
    });

    test('module no options', function() {
      var options = { xwoot: true };
      return subject.run('noop', options).then(
        function(result) {
          assert.deepEqual(result, options);
        }
      );
    });

    test('with module config', function() {
      var options = {
        a: 'added'
      };

      return subject.run('noop_options', options).then(function(result) {
        var expected = {
          a: options.a,
          bugzilla: config('bugzilla'),
          mongodb: config('mongodb')
        };

        assert.deepEqual(result, expected);
      });
    });

    test('timeout', function(done) {
      var options = {
        // this is specific to out test fixture not a general task option
        timesout: 500
      };

      subject.run('noop_timesout', options).then(null, function(error) {
        assert.ok(error);
        done();
      });
    });
  });
});
