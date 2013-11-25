function main() {
  var express = require('express'),
      app = express(),
      mongoskin = require('mongoskin'),
      configLoader = require('./config');


  // configuration
  var config = configLoader();

  app.set('github', config.github);
  app.set('bugzilla', config.bugzilla);

  // parse json
  app.use(express.json());
  app.use(express.logger());

  app.set('db', mongoskin.db(
    process.env.MONGOLAB_URI || 'mongodb://localhost/shepherd_development',
    // at least one server acks the write and its journaled
    { w: 1, j: 1 }
  ));

  // "track" is the language used to indicate we should care about this pull
  // request.
  app.post('/track', require('./routes/track'));

  app.get('/hello', function(req, res) {
    res.send(200, { message: 'it works!' });
  });

  app.get('/', function(req, res) {
    res.send(200, "The door closes behind you.");
  });

  return app;
}

if (require.main === module) {
  main().listen(process.env.PORT || 60001);
}

module.exports = main;
