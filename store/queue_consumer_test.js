suite('queue consumer', function() {
  var Consumer = require('./queue_consumer'),
      amqp = require('../test/amqp')(),
      tasks = require('../queues/tasks'),
      jsonbin = require('../lib/binary_json');


  setup(function() {
    subject = new Consumer(amqp.channel, tasks.REQUEST_QUEUE);
  });

  test('#consume', function(done) {
    var content = { wow: true, array: [1, 2, 3] };

    subject.consume(function(channel, message) {
      assert.deepEqual(message.content, content);
      // ack the message
      channel.ack(message);
      done();
    });

    amqp.channel.publish(
      tasks.EXCHANGE,
      tasks.REQUEST_QUEUE,
      jsonbin.encode(content),
      {
        // must pass correct content type
        contentType: 'application/json'
      }
    );
  });
});
