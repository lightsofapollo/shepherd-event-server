var binjson = require('../lib/binary_json');

function Publisher(channel, exchange) {
  this.channel = channel;
  this.exchange = exchange;
}

Publisher.prototype = {
  publish: function(route, message) {
    return this.channel.publish(
      this.exchange,
      route,
      binjson.encode(message),
      {
        contentType: binjson.MIME,
        // everything is persistent right now
        persistent: true
      }
    );
  }
};

module.exports = Publisher;
