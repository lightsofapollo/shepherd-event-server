module.exports = function(options, callback) {
  if (!options.timesout) return callback(null, options);

  setTimeout(callback, options.timesout, null);
};
