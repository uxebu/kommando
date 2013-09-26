var driverLauncher = require('../driver-launcher.js');

var address = require('address');
var freeport = require('freeport');
var webdrvr = require('webdrvr');

module.exports = function(options) {

  return {
    _launcher: null,
    _seleniumUrl: '',
    create: function(callback) {
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
        }
        this._launcher = driverLauncher('java', driverLauncherOptions).start(function(error, url) {
          console.log('Selenium server started at: ' + url);
          this._seleniumUrl = url;
          callback(error, url, {});
        }.bind(this));

      }.bind(this));
    },
    end: function(results, callback) {
      console.log('Shutting down Selenium server at: ' + this._seleniumUrl);
      this._launcher.stop(callback);
    }
  };

};
