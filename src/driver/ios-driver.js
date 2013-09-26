var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');
var lodash = require('lodash');
var webdrvr = require('webdrvr');

module.exports = function(options) {

  var launcher = null;
  var seleniumUrl = '';

  return {
    updateCapabilities: function(caps) {
      var updatedCaps = caps;
      if (['ipad', 'iphone'].indexOf(caps.browserName) > -1) {
        updatedCaps = lodash.merge({}, {
          language: 'en'
        }, caps);
      }
      return updatedCaps;
    },
    start: function(callback) {
      console.log('Starting iOS-Driver server ...');
      var args = ['-jar', webdrvr.iosdriver.path, '-simulators', '-port', port]
        .concat(options.args || []);
      freeport(function(err, port) {
        var driverLauncherOptions = {
          args: args,
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: '/wd/hub'
        }
        launcher = driverLauncher('java', driverLauncherOptions).start(function(error, url) {
          if (error) {
            callback(error);
          } else {
            console.log('iOS-Driver server started at: ' + url);
            seleniumUrl = url;
            callback(null, url);
          }
        }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down iOS-Driver server at: ' + seleniumUrl);
      launcher.stop(callback);
    }
  };

};
