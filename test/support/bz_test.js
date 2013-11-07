suite('support/bz', function() {
  var client = require('./bz')(),
      bugFactory = require('../factory/bug');

  test('create bug', function(done) {
    client.createBug(bugFactory.create(), function(err, res) {
      if (err) return done(err);
      assert.equal(typeof res, 'number');
      done();
    });
  });
});
