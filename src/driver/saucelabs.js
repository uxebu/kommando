'use strict';

var url = require('url');

var async = require('async');
var lodash = require('lodash');
var SauceLabs = require('saucelabs');

module.exports = function(options) {

  var sauceAccount = null;

  return {
    updateCapabilities: function(caps) {
      return lodash.merge({}, {
        username: options.sauceUser,
        accessKey: options.sauceKey,
        name: options.sauceName,
        build: options.sauceBuild,
        tags: options.sauceTags
      }, caps);
    },
    start: function(callback) {
      sauceAccount = new SauceLabs({
        username: options.sauceUser,
        password: options.sauceKey
      });

      var seleniumUrl = {
        protocol: 'http',
        hostname: 'ondemand.saucelabs.com',
        port: 80,
        pathname: '/wd/hub'
      };

      console.log('Using SauceLabs selenium server at: ' + url.format(seleniumUrl));

      seleniumUrl.auth = options.sauceUser + ':' + options.sauceKey;
      seleniumUrl = url.format(seleniumUrl);

      callback(null, seleniumUrl);
    },
    stop: function(results, callback) {
      var sauceUpdateFunctions = [];
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
