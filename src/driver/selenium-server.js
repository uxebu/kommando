var remote = require('selenium-webdriver/remote');
var webdrvr = require('webdrvr');

module.exports = function(config, callback) {

  var seleniumUrl;
  var seleniumArgs = webdrvr.args.concat(config.seleniumArgs || []);
  var seleniumServer = new remote.SeleniumServer(webdrvr.selenium.path, {
    args: seleniumArgs
  });

  seleniumServer.start().then(function(url) {
    console.log('Selenium server started at: ' + url);
    seleniumUrl = url;

    callback(null, {
      seleniumUrl: url,
      capabilities: {},
      end: function(resultData, callback) {
        console.log('Shutting down selenium server at: ' + seleniumUrl);
        seleniumServer.stop();
        callback(null);
      }
    });
  });

};
