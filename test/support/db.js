var TEST_DB = 'mongodb://localhost/shepherd_test';

/**
 - sets the process.env.MONGOLAB_URI to a test db
 - drops database
*/
function dbSetup() {
  var mongoskin = require('mongoskin');

  suiteSetup(function() {
    // dirty hack to ensure we use a test db.
    process.env.MONGOLAB_URI = TEST_DB;
  });

  setup(function(done) {
    // we need to open it first
    mongoskin.db(TEST_DB, { w: 0 }).open(function(err, db) {
      if (err) return done(err);

      // with the reference we can drop it
      db.dropDatabase(done);
    });
  });

  return TEST_DB;
}

module.exports = dbSetup;
