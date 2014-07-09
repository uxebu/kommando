'use strict';

var digdugAdapter = require('../digdug.js');
var DigdugTestingBotTunnel = require('digdug/TestingBotTunnel');

module.exports = function(options) {
  return digdugAdapter('TestingBot', DigdugTestingBotTunnel, options);
};
