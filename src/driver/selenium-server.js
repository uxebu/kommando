var remote = require('selenium-webdriver/remote');
var webdrvr = require('webdrvr');

module.exports = function(config) {

  return {
    _seleniumServer: null,
    _seleniumUrl: '',
    create: function(callback) {
      console.log('Starting selenium server ...');
      this._seleniumServer = new remote.SeleniumServer(webdrvr.selenium.path, {
        args: webdrvr.args.concat(config.seleniumArgs || [])
      })
      this._seleniumServer.start().then(function(url) {
        console.log('Selenium server started at: ' + url);
        this._seleniumUrl = url;
        callback(null, url, {});
      }.bind(this));
    },
    end: function(results, callback) {
      console.log('Shutting down selenium server at: ' + this._seleniumUrl);
      this._seleniumServer.stop();
      callback(null);
    }
  };

};
