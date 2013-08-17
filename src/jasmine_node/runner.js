var jasmine = require('jasmine-node');
require('./jasminewd.js');
var webdriver = require('selenium-webdriver');

/*
- browserName (capabilities)
- baseUrl
- imageUrl
- seleniumAddress
*/

var run = module.exports = function(config, runnerCallback) {
  var onComplete = function(runner, log) {
    var passed = false;
    if (runner.results().failedCount === 0) {
      passed = true;
    }
    runnerCallback(null, passed);
  };

  var options = {
    match: '.',
    matchall: false,
    specNameMatcher: 'spec',
    extensions: 'js',
    regExpSpec: /.spec\.(js)$/i,
    specFolders: config.args.specFolders,
    onComplete: onComplete,
    isVerbose: false,
    showColors: true,
    teamcity: false,
    coffee: false,
    useRequireJs: false,
    junitReport: {}
  };

  global.client = config.client;
  global.webdriver = webdriver;

  jasmine.executeSpecsInFolder(options);
};
