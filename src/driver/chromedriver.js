'use strict';

var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');
var webdrvr = require('webdrvr');

module.exports = function(options) {

  var launcher = null;
  var seleniumUrl = '';

  return {
    updateCapabilities: function(caps) {
      return caps;
    },
    start: function(callback) {
      console.log('Starting standalone Chromedriver ...');

      freeport(function(err, port) {
        var args = ['--port=' + port]
          .concat(options.args || []);
        
        var driverLauncherOptions = {
          args: args,
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: ''
        };
        launcher = driverLauncher(webdrvr.chromedriver.path, driverLauncherOptions).start(function(error, url) {
          if (error) {
            callback(error);
          } else {
            console.log('Standalone Chromedriver started at: ' + url);
            seleniumUrl = url;
            callback(null, url);
          }
        }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down standalone Chromedriver at: ' + seleniumUrl);
      launcher.stop(callback);
    }
  };

};
