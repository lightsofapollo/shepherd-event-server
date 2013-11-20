global.assert = require('assert');
process.env.NODE_ENV = 'test';

require('mocha-as-promised')();
