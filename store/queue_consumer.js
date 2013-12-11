var binjson = require('../lib/binary_json');

function QueueConsumer(channel, queue) {
  this.channel = channel;
  this.queue = queue;
}

QueueConsumer.prototype = {
  onMessage: function(consumer, msg) {
    // ignore messages without details
    if (!msg) return;

    // format message if we know its json
    if (msg.properties.contentType === binjson.MIME) {
      msg.content = binjson.decode(msg.content);
    }

    // pass message to downstream consumer
    consumer(this.channel, msg);
  },

  consume: function(callback) {
    this.channel.consume(
      this.queue,
      // channel is passed to the callback
      this.onMessage.bind(this, callback)
    );
  }
};

module.exports = QueueConsumer;
