var Request = {
  states: Object.freeze({
    NEW: 'new',
    TRACKED: 'tracked'
  }),

  /**
  Check object for data errors.

  @param {Object} model to check.
  @return {Null|Error} null when valid error object otherwise.
  */
  checkForErrors: function(model) {
    // this is generally terrible performance but we don't care for < 10 items
    // anyway.
    var state = model.state;

    if (!state) return new Error('.state is falsy');

    var hasState = Object.keys(Request.states).some(function(key) {
      return Request.states[key] === state;
    });

    if (!hasState) return new Error('invalid .state: "' + state + '"');
  }
};

module.exports = Request;
