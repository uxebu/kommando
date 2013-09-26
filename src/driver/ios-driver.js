var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');
var webdrvr = require('webdrvr');

module.exports = function(options) {

  var launcher = null;
  var seleniumUrl = '';

  return {
    start: function(callback) {
      console.log('Starting iOS-Driver server ...');

      freeport(function(err, port) {
        var driverLauncherOptions = {
          args: [
            '-jar', webdrvr.iosdriver.path, '-simulators', '-port', port
          ],
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: '/wd/hub'
        }
        launcher = driverLauncher('java', driverLauncherOptions).start(function(error, url) {
          console.log('iOS-Driver server started at: ' + url);
          seleniumUrl = url;
          callback(error, url, {});
        }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down iOS-Driver server at: ' + seleniumUrl);
      launcher.stop(callback);
    }
  };

};
