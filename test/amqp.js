var Promise = require('promise');

function connect(invoke) {
  var state = {},
      config = require('../config'),
      amqp = require('amqplib');


  setup(function() {
    return amqp.connect(config('amqp').uri).then(
      function(connection) {
        return state.connection = connection;
      }
    ).then(
      function(connection) {
        return connection.createChannel();
      }
    ).then(
      function(channel) {
        state.channel = channel;
      }
    );
  });

  invoke && invoke(state);

  teardown(function() {
    return state.connection.close();
  });

  return state;
}

module.exports = connect;
