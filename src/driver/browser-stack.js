'use strict';

var digdugAdapter = require('../digdug.js');
var DigdugBrowserStackTunnel = require('digdug/BrowserStackTunnel');

module.exports = function(options) {
  return digdugAdapter('BrowserStack', DigdugBrowserStackTunnel, options);
};
