function main() {
  var express = require('express'),
      app = express(),
      mongoskin = require('mongoskin'),
      config = require('./config.json');

  app.set('db', mongoskin.db(
    process.env.MONGOURL || config.mongodb,
    // at least one server acks the write and its journaled
    { w: 1, j: 1 }
  ));

  return app;
}

if (require.main === module) {
  main().listen(process.env.PORT || 60001);
}

module.exports = main;
