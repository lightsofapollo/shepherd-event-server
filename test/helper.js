// setup test.env's
var envs = require('envfile').parseFileSync(__dirname + '/../test.env');
for (var key in envs) process.env[key] = envs[key];

global.assert = require('assert');
require('mocha-as-promised')();
