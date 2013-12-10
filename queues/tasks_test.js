suite('tasks', function() {
  var tasks = require('./tasks'),
      amqp = require('amqplib'),
      config = require('../config'),
      Promise = require('promise');

  var channel,
      connection;

  setup(function() {
    return amqp.connect(config('amqp').uri).then(
      function(_con) {
        connection = _con;
        return connection.createChannel();
      }
    ).then(
      function(_chan) {
        return channel = _chan;
      }
    );
  });

  suite('#destroy', function() {
    setup(function() {
      // create some related thing
      return Promise.all([
        channel.assertExchange(tasks.EXCHANGE, 'direct'),
        channel.assertQueue(tasks.REQUEST_QUEUE),
        channel.assertQueue(tasks.RESPONSE_QUEUE)
      ]);
    });

    setup(function() {
      return tasks.destroy(channel);
    });

    test('exchange is removed', function(done) {
      channel.once('error', function(err) {
        assert.ok(err.message.match(tasks.EXCHANGE));
        assert.ok(err.message.match(/404/));
        done();
      });

      channel.checkExchange(tasks.EXCHANGE);
    });

    test('request queue is removed', function(done) {
      channel.once('error', function(err) {
        assert.ok(err.message.match(tasks.REQUEST_QUEUE));
        assert.ok(err.message.match(/404/));
        done();
      });

      channel.checkQueue(tasks.REQUEST_QUEUE);
    });

    test('response queue is removed', function(done) {
      channel.once('error', function(err) {
        assert.ok(err.message.match(tasks.RESPONSE_QUEUE));
        assert.ok(err.message.match(/404/));
        done();
      });

      channel.checkQueue(tasks.RESPONSE_QUEUE);
    });
  });

  suite('#define', function() {
    setup(function() {
      return tasks.define(channel);
    });

    teardown(function() {
      tasks.destroy(channel);
    });

    function pubsub(queue) {
      test(queue + ' pub/sub', function(done) {
        var buffer = new Buffer('xxx');

        // publish to exchange
        var pub = channel.publish(
          tasks.EXCHANGE, tasks.REQUEST_QUEUE, buffer
        );

        // attempt the consume
        channel.consume(tasks.REQUEST_QUEUE, function(msg) {
          if (!msg) return;
          assert.equal(msg.content.toString(), buffer.toString());
          done();
        });
      });
    }

    pubsub(tasks.REQUEST_QUEUE);
    pubsub(tasks.RESPONSE_QUEUE);
  });

});
