function main() {
  var express = require('express'),
      app = express(),
      mongoskin = require('mongoskin'),
      config = require('./config.json');

  // parse json
  app.use(express.json());
  app.use(express.logger());

  app.set('db', mongoskin.db(
    process.env.MONGOLAB_URI || config.mongodb,
    // at least one server acks the write and its journaled
    { w: 1, j: 1 }
  ));

  app.configure(function() {
    var envs = process.env;
    app.set('bugzilla', Object.freeze({
      url: envs.BUGZILLA_URL || 'https://bugzilla.mozilla.org/rest/',
      username: envs.BUGZILLA_USERNAME,
      password: envs.BUGZILLA_PASSWORD
    }));

    app.set('github', Object.freeze({
      token: envs.GITHUB_TOKEN
    }));
  });

  app.configure('test', function() {
    var config = require('./test_config.json');
    app.set('github', config.github);
    app.set('bugzilla', config.bugzilla);
  });


  // "track" is the language used to indicate we should care about this pull
  // request.
  app.post('/track', require('./routes/track'));

  app.get('/hello', function(req, res) {
    res.send(200, { message: 'it works!' });
  });

  return app;
}

if (require.main === module) {
  main().listen(process.env.PORT || 60001);
}

module.exports = main;
