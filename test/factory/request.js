var Factory = require('object-factory'),
    Request = require('../../models/request');

module.exports = new Factory({
  properties: {
    projectId: null,
    state: Request.states.NEW
  }
});
