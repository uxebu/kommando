var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');
var webdrvr = require('webdrvr');

module.exports = function(config) {

  return {
    _launcher: null,
    _seleniumUrl: '',
    create: function(callback) {
      console.log('Starting iOS-Driver server ...');

      freeport(function(err, port) {
        var options = {
          args: [
            '-jar', webdrvr.iosdriver.path, '-simulators', '-port', port
          ],
          hostname: address.ip() || address.ip('lo'),
          port: port,
          path: '/wd/hub'
        }
        this._launcher = driverLauncher('java', options).start(function(error, url) {
          console.log('iOS-Driver server started at: ' + url);
          this._seleniumUrl = url;
          callback(error, url, {});
        }.bind(this));

      }.bind(this));
    },
    end: function(results, callback) {
      console.log('Shutting down iOS-Driver server at: ' + this._seleniumUrl);
      this._launcher.stop(callback);
    }
  };

};