suite('support/bz', function() {
  var client = require('./bz')(),
      bugFactory = require('../factory/bug');

  test('find a bug', function(done) {
    client.getBug(10000, function(err, res) {
      assert.ok(!err, 'is successful');
      assert(Array.isArray(res.bugs), 'has bug list');
      done(err);
    });
  });

  test('create bug', function(done) {
    client.createBug(bugFactory(), function(err, res) {
      if (err) return done(err);
      assert.equal(typeof res, 'number');
      done();
    });
  });
});
