var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');

module.exports = function(options) {

  var launcher = null;
  var seleniumUrl = '';

  return {
    start: function(callback) {
      console.log('Starting Appium server ...');

      freeport(function(err, port) {
        var driverLauncherOptions = {
          args: [
            '--port', port
          ],
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: '/wd/hub'
        }
        launcher = driverLauncher(options.appiumPath || 'appium', driverLauncherOptions)
          .start(function(error, url) {
            console.log('Appium server started at: ' + url);
            seleniumUrl = url;
            callback(error, url, {});
          }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down Appium server at: ' + seleniumUrl);
      launcher.stop(callback);
    }
  };

};
