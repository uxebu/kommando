var jasmine = require('jasmine-node');
var webdriver = require('selenium-webdriver');

/*
- browserName (capabilities)
- baseUrl
- imageUrl
- seleniumAddress
*/

var run = module.exports = function(config) {
  require('./jasminewd.js');
  var onComplete = function(runner, log) {
    var passed = false;
    if (runner.results().failedCount === 0) {
      passed = true;
    }
    config.runnerCallback(null, passed);
  };

  var options = {
    match: '.',
    matchall: false,
    specNameMatcher: 'spec',
    extensions: 'js',
    regExpSpec: /.spec\.(js)$/i,
    specFolders: config.runnerArgs.specFolders,
    onComplete: onComplete,
    isVerbose: false,
    showColors: true,
    teamcity: false,
    coffee: false,
    useRequireJs: false,
    junitReport: {}
  };

  jasmine.getEnv().client = config.client;
  jasmine.getEnv().webdriver = webdriver;

  jasmine.executeSpecsInFolder(options);
};
