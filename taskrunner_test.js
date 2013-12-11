suite('taskrunner', function() {
  var Producer = require('./store/queue_producer'),
      Consumer = require('./store/queue_consumer'),
      TaskQueue = require('./queues/tasks'),
      amqp = require('./test/amqp_clean')();

  var spawn = require('child_process').spawn;
  var childProc;

  setup(function() {
    var env = {};

    for (var key in process.env) env[key] = process.env[key];

    childProc = spawn('node', [__dirname + '/taskrunner'], {
      env: env,
      cwd: process.cwd()
    });

    childProc.stderr.pipe(process.stderr);
    childProc.stdout.pipe(process.stdout);
  });

  teardown(function() {
    childProc.kill();
  });

  var request, response;
  setup(function() {
    request = new Producer(amqp.channel, TaskQueue.EXCHANGE);
    response = new Consumer(amqp.channel, TaskQueue.RESPONSE_QUEUE);
  });

  test('roundtrip request', function(done) {
    var id = 10;
    var options = { woot: true, array: [1, 2, 3] };

    request.publish(TaskQueue.REQUEST_QUEUE, {
      taskId: id,
      task: 'passthrough',
      options: options
    });

    response.consume(function(channel, message) {
      var content = message.content;
      assert.deepEqual(content, {
        taskId: id,
        success: true,
        result: options
      });
      channel.ack(message);
      done();
    });
  });

});
