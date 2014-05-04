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
      console.log('Starting Selenium server ...');

      freeport(function(err, port) {
        var args = ['-jar', webdrvr.selenium.path, '-port', port]
          .concat(webdrvr.args)
          .concat(options.args || []);

        var driverLauncherOptions = {
          args: args,
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: '/wd/hub'
        };
        launcher = driverLauncher('java', driverLauncherOptions).start(function(error, url) {
          if (error) {
            callback(error);
          } else {
            console.log('Selenium server started at: ' + url);
            seleniumUrl = url;
            callback(null, url);
          }
        }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down Selenium server at: ' + seleniumUrl);
      launcher.stop(callback);
    }
  };

};
