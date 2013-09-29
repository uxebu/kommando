var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');
var lodash = require('lodash');

module.exports = function(options) {

  var launcher = null;
  var seleniumUrl = '';

  return {
    updateCapabilities: function(caps) {
      var updatedCaps = caps;
      if (['ipad', 'iphone'].indexOf(caps.browserName) > -1) {
        updatedCaps = lodash.merge({}, {
          device: caps.browserName,
          app: 'safari',
          version: '6.1'
        }, caps);
      }
      return updatedCaps;
    },
    start: function(callback) {
      console.log('Starting Appium server ...');
      freeport(function(err, port) {
        var args = ['--port', port].concat(options.args || []);
        var driverLauncherOptions = {
          args: args,
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: '/wd/hub'
        };
        launcher = driverLauncher(options.appiumPath || 'appium', driverLauncherOptions)
          .start(function(error, url) {
            if (error) {
              callback(error);
            } else {
              console.log('Appium server started at: ' + url);
              seleniumUrl = url;
              callback(null, url);
            }
          }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down Appium server at: ' + seleniumUrl);
      launcher.stop(callback);
    }
  };

};
