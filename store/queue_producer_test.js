suite('queue consumer', function() {
  var Consumer = require('./queue_consumer'),
      Producer = require('./queue_producer'),
      amqp = require('../test/amqp')(),
      tasks = require('../queues/tasks'),
      jsonbin = require('../lib/binary_json');


  var consumer;
  var producer;
  setup(function() {
    consumer = new Consumer(amqp.channel, tasks.REQUEST_QUEUE);
    producer = new Producer(amqp.channel, tasks.EXCHANGE);
  });

  test('#publish', function(done) {
    var content = { wow: true, array: [1, 2, 3] };

    consumer.consume(function(channel, message) {
      assert.deepEqual(message.content, content);
      // ack the message
      channel.ack(message);
      done();
    });

    producer.publish(tasks.REQUEST_QUEUE, content);
  });
});

