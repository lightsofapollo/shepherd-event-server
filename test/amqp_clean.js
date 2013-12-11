var amqp = require('./amqp'),
    tasks = require('../queues/tasks');

module.exports = function() {
  return amqp(function(state) {
    setup(function() {
      return tasks.define(state.channel);
    });

    teardown(function() {
      return tasks.destroy(state.channel);
    });
  });
};
