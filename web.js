function main() {
  var express = require('express'),
      app = express(),
      mongoskin = require('mongoskin'),
      config = require('./config');


  app.set('github', config('github'));
  app.set('bugzilla', config('bugzilla'));
  app.set(
    'db',
    mongoskin.db(config('mongodb').uri, config('mongodb').config)
  );

  // parse json
  app.use(express.json());
  app.use(express.logger());

  // "track" is the language used to indicate we should care about this pull
  // request.
  app.post('/track', require('./routes/track'));

  app.get('/hello', function(req, res) {
    res.send(200, { message: 'it works!' });
  });

  app.get('/', function(req, res) {
    res.send(200, 'The door closes behind you.');
  });

  return app;
}

if (require.main === module) {
  main().listen(process.env.PORT || 60001);
}

module.exports = main;
