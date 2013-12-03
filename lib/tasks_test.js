suite('tasks', function() {
  var Tasks = require('./tasks'),
      config = require('../config');

  var tasks = {
    'noop': {
      module: __dirname + '/../test/noop_task'
    },
    'noop_options': {
      module: __dirname + '/../test/noop_task',
      configKeys: ['bugzilla', 'mongodb']
    }
  };

  var subject;
  setup(function() {
    subject = new Tasks(tasks);
  });

  test('.run - not available module', function(done) {
    subject.run('ihaznoname', {}).then(null, function(err) {
      assert.ok(err);
      done();
    });
  });

  test('.run - module no options', function() {
    var options = { xwoot: true };
    return subject.run('noop', options).then(
      function(result) {
        assert.deepEqual(result, options);
      }
    );
  });

  test('.run - with module config', function() {
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
});
