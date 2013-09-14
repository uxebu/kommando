var url = require('url');

var async = require('async');
var SauceLabs = require('saucelabs');

module.exports = function(config) {
  
  return {
    _sauceAccount: null,
    create: function(callback) {
      this._sauceAccount = new SauceLabs({
        username: config.sauceUser,
        password: config.sauceKey
      });

      var seleniumUrl = {
        protocol: 'http',
        hostname: 'ondemand.saucelabs.com',
        port: 80,
        pathname: '/wd/hub'
      };

      console.log('Using SauceLabs selenium server at: ' + url.format(seleniumUrl));

      seleniumUrl.auth = config.sauceUser + ':' + config.sauceKey;
      seleniumUrl = url.format(seleniumUrl);

      callback(null, seleniumUrl, {
        username: config.sauceUser,
        accessKey: config.sauceKey,
        name: config.sauceName,
        build: config.sauceBuild,
        tags: config.sauceTags
      });
    },
    end: function(results, callback) {
      var sauceUpdateFunctions = [];
      var sauceAccount = this._sauceAccount;
      results.forEach(function(result) {
        result.clientIds.forEach(function(clientId) {
          sauceUpdateFunctions.push(
            sauceAccount.updateJob.bind(
              sauceAccount, clientId, {passed: result.passed}
            )
          );
        });
      });
      async.series(sauceUpdateFunctions, function(error) {
        callback(error);
      });
    }
  };

};
