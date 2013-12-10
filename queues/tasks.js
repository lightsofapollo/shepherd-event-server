var Promise = require('promise');

// name constants
var EXCHANGE = 'tasks';
var REQUEST_QUEUE = 'task-request';
var RESPONSE_QUEUE = 'task-response';

/**
Queues and exchanges are much like any other schema. We need to define
the exchanges and queues prior to using them for pub/sub.
*/

/**
Define our AMQP queue/exchange structure on the given connection.
*/
function defineSchema(channel) {
  var options = {
    durable: true
  };

  return Promise.all([
    channel.assertExchange(EXCHANGE, 'direct', options),
    channel.assertQueue(REQUEST_QUEUE, options),
    channel.assertQueue(RESPONSE_QUEUE, options)
  ]).then(function() {
    return Promise.all([
      channel.bindQueue(REQUEST_QUEUE, EXCHANGE, REQUEST_QUEUE),
      channel.bindQueue(RESPONSE_QUEUE, EXCHANGE, RESPONSE_QUEUE)
    ]);
  });
}

/**
Delete all schema related to tasks. Mostly for tests.
*/
function destroySchema(channel) {
  return Promise.all([
    channel.deleteExchange(EXCHANGE),
    channel.deleteQueue(REQUEST_QUEUE),
    channel.deleteQueue(RESPONSE_QUEUE)
  ]);
}

module.exports = {
  // naming constants
  EXCHANGE: EXCHANGE,
  REQUEST_QUEUE: REQUEST_QUEUE,
  RESPONSE_QUEUE: RESPONSE_QUEUE,

  define: defineSchema,
  destroy: destroySchema
};
