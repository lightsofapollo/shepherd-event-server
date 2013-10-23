var TEST_DB = 'mongodb://localhost/shepherd_test';

/**
 - sets the process.env.MONGOURL to a test db
 - drops database
*/
function dbSetup() {
  var mongoskin = require('mongoskin');

  // dirty hack to ensure we use a test db.
  process.env.MONGOURL = TEST_DB;

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
