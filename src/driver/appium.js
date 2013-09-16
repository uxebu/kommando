var appium = require('appium');
var url = require('url');

var defaultAppiumArgs = {
  app: null,
  ipa: null,
  quiet: true,
  udid: null,
  keepArtifacts: false,
  noSessionOverride: false,
  fullReset: false,
  noReset: false,
  launch: false,
  log: false,
  nativeInstrumentsLib: false,
  safari: false,
  forceIphone: false,
  forceIpad: false,
  orientation: null,
  useKeystore: false,
  address: '0.0.0.0',
  nodeconfig: null
};

module.exports = function(config) {

  return {
    _webServer: null,
    _appiumServer: null,
    _seleniumUrl: '',
    create: function(callback) {
      console.log('Starting appium server ...');
      this._webServer = appium.run(defaultAppiumArgs, function(appiumServer) {
        var seleniumUrl = this._seleniumUrl = url.format({
          protocol: 'http',
          hostname: 'localhost',
          port: this._webServer.address().port,
          pathname: '/wd/hub'
        });
        this._appiumServer = appiumServer;
        console.log('Appium server started at: ' + seleniumUrl);
        callback(null, seleniumUrl, {});
      }.bind(this));
    },
    end: function(results, callback) {
      console.log('Shutting down appium server at: ' + this._seleniumUrl);
      this._appiumServer.stop(function() {
        this._webServer.close(callback);
      }.bind(this));
    }
  };

};
