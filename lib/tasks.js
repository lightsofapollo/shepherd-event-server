var Promise = require('promise'),
    config = require('../config');

/**
@param {Object} taskConfig for all runs of this type of task.
@param {Object} overrides for a particular task run.
@return {Object} fresh configuration object.
*/
function mergeConfigurations(taskConfig, overrides) {
  // new object to copy into
  var options = {};

  // tasks can request the configuration details from the server
  if (taskConfig.configKeys) {
    taskConfig.configKeys.forEach(function(key) {
      // validation must be done at review time sensitive information might be
      // in here. We don't need to worry about mutation of objects we don't
      // share these objects with primary configuration of the server.
      options[key] = config(key);
    });
  }

  // copy over the task run overrides.
  for (var key in overrides) options[key] = overrides[key];
  return options;
}

function Tasks(tasks) {
  this.taskConfig = tasks;
}

Tasks.prototype = {
  run: function(name, options) {
    return new Promise(function(accept, reject) {
      var taskConfig = this.taskConfig[name];

      if (!taskConfig) {
        return reject(new Error('invalid name: "' + module + '"'));
      }

      var task = Promise.denodeify(
        require(require.resolve(taskConfig.module))
      );

      task(mergeConfigurations(taskConfig, options)).then(accept, reject);
    }.bind(this));

  }
};

module.exports = Tasks;
