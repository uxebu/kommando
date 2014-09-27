'use strict';

var digdugAdapter = require('../digdug.js');
var DigdugSauceLabsTunnel = require('digdug/SauceLabsTunnel');

module.exports = function(options) {
  return digdugAdapter('SauceLabs', DigdugSauceLabsTunnel, options);
};
