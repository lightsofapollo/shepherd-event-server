suite('request', function() {
  var subject = require('./request');

  suite('check for errors', function() {
    test('valid state', function() {
      assert.ok(!subject.checkForErrors({ state: subject.states.NEW }));
    });

    test('invalid state', function() {
      var error = subject.checkForErrors({ state: 'xfoo' });
      assert.ok(error, 'has error');
      assert.ok(error.message.indexOf('.state') !== -1);
    });
  });

});
