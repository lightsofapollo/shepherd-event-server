var Request = require('./request'),
    Factory = require('object-factory');

var GithubDetails = new Factory({
  properties: {
    number: 1
  }
});

module.exports = Request.extend({
  properties: {
    github: GithubDetails,
    type: 'github'
  }
});
