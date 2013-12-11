var amqp = require('amqplib'),
    config = require('./config'),
    TaskQueue = require('./queues/tasks'),
    Tasks = require('./lib/tasks'),
    Consumer = require('./store/queue_consumer'),
    Producer = require('./store/queue_producer');

var debug = require('debug')('taskrunner');

var CONCURRENCY = 1;
var TaskHandler = new Tasks(require('./tasks'));

function amqpConnect() {
  var connection;
  var channel;

  // connect to amqp
  return amqp.connect(config('amqp').uri, { heartbeat: 10 }).then(
    function(_connection) {
      connection = _connection;
      return connection.createChannel();
    }
  ).then(
    function(_channel) {
      channel = _channel;
      return channel.prefetch(CONCURRENCY);
    }
  ).then(
    function() {
      return channel;
    }
  );
}

function consumeTasks(consumer, publisher) {
  consumer.consume(function(channel, message) {
    /**
    {
      task: '...',
      options: '...'
    }
    */
    var content = message.content;
    debug('task start', content);
    TaskHandler.run(
      content.task, content.options || {}
    ).then(
      function(result) {
        debug('task success', result);
        publisher.publish(TaskQueue.RESPONSE_QUEUE, {
          taskId: content.taskId,
          success: true,
          result: result
        });
        channel.ack(message);
      },
      function(error) {
        debug('task error', error);
        publisher.publish(TaskQueue.RESPONSE_QUEUE, {
          taskId: content.taskId,
          success: false,
          result: error
        });
        channel.ack(message);
      }
    );
  });
}

function main() {
  var channel;
  return amqpConnect().then(
    function(_channel) {
      channel = _channel;
      return TaskQueue.define(channel);
    }
    // define the schema
  ).then(
    function() {
      return consumeTasks(
        new Consumer(channel, TaskQueue.REQUEST_QUEUE),
        new Producer(channel, TaskQueue.EXCHANGE)
      );
    }
  );
}

if (require.main === module) main();
module.exports = main;
