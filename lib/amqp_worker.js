/**
General abstraction for our amqp "worker" nodes...

XXX: I am not entirely happy with how this is setup but this is a good
central place to add better heartbeat logic / timeout logic / error handling
related to socket timeouts, etc...
*/

var amqp = require('amqplib'),
    config = require('../config');

// queues
var TaskQueue = require('../queues/tasks');

function Worker(connection, channel) {
  this.connection = connection;
  this.channel = channel;
}

Worker.prototype = {};

Worker.create = function() {
  var connection;
  var channel;

  return amqp.connect(
    config('amqp').uri, { heartbeat: 10 }
  ).then(
    function(_connection) {
      connection = _connection;
      return connection.createChannel();
    }
  ).then(
    function(_channel) {
      channel = _channel;
      return TaskQueue.define(channel);
    }
  ).then(function() {
    return new Worker(connection, channel);
  });
};

module.exports = Worker;
