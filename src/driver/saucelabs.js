var async = require('async');
var SauceLabs = require('saucelabs');

module.exports = function(config, callback) {
  var sauceAccount = new SauceLabs({
    username: config.sauceUser,
    password: config.sauceKey
  });
  var seleniumUrl = [
    'http://',
    config.sauceUser,
    ':',
    config.sauceKey,
    '@ondemand.saucelabs.com:80/wd/hub'
  ].join('');

  console.log('Using SauceLabs selenium server at: ' + seleniumUrl);

  callback(null, seleniumUrl, {
    username: config.sauceUser,
    accessKey: config.sauceKey,
    name: config.sauceName,
    build: config.sauceBuild,
    tags: config.sauceTags
  }, function endSauceLabs(results, callback) {
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
  })
};
