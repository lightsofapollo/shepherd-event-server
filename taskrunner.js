var Worker = require('./lib/amqp_worker'),
    TaskQueue = require('./queues/tasks'),
    Tasks = require('./lib/tasks'),
    Consumer = require('./store/queue_consumer'),
    Producer = require('./store/queue_producer');

var debug = require('debug')('taskrunner');

var CONCURRENCY = 1;

function consumeTasks(consumer, publisher) {
  var TaskHandler = new Tasks(require('./tasks'));

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
  var worker;

  Worker.create().then(
    function(_worker) {
      worker = _worker;
      return worker.channel.prefetch(CONCURRENCY);
    }
  ).then(
    function() {
      return consumeTasks(
        new Consumer(worker.channel, TaskQueue.REQUEST_QUEUE),
        new Producer(worker.channel, TaskQueue.EXCHANGE)
      );
    }
  ).then(
    null,
    function(err) {
      throw err;
    }
  );
}

if (require.main === module) main();
module.exports = main;
