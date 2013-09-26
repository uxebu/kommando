var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');

module.exports = function(options) {

  return {
    _launcher: null,
    _seleniumUrl: '',
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
        this._launcher = driverLauncher(options.appiumPath || 'appium', driverLauncherOptions)
          .start(function(error, url) {
            console.log('Appium server started at: ' + url);
            this._seleniumUrl = url;
            callback(error, url, {});
          }.bind(this));

      }.bind(this));
    },
    stop: function(results, callback) {
      console.log('Shutting down Appium server at: ' + this._seleniumUrl);
      this._launcher.stop(callback);
    }
  };

};
