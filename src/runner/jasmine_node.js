var jasmine = require('jasmine-node');
require('./jasminewd.js');

var webdriver = require('selenium-webdriver');
var SandboxedModule = require('sandboxed-module');

/*
- browserName (capabilities)
- baseUrl
- imageUrl
- seleniumAddress
*/

var initialRun = true;
var currentConfig;

var run = module.exports = function(config) {
  currentConfig = config;
  var onComplete = function(runner, log) {
    var passed = false;
    if (runner.results().failedCount === 0) {
      passed = true;
    }
    config.runnerCallback(null, passed, currentConfig.client);
  };

  var options = {
    match: '.',
    matchall: false,
    specNameMatcher: 'spec',
    extensions: 'js',
    regExpSpec: /.spec\.(js)$/i,
    specFolders: [],
    onComplete: onComplete,
    isVerbose: false,
    showColors: true,
    teamcity: false,
    coffee: false,
    useRequireJs: false,
    junitReport: {}
  };

  for (var i = 0, l = config.runnerArgs.specs.length; i < l; i++) {
    SandboxedModule.require(config.runnerArgs.specs[i], {
      locals: {
        client: config.client,
        webdriver: webdriver
      }
    });
  }

  if (initialRun) {
    jasmine.executeSpecsInFolder(options);
    initialRun = false;
  } else {
    jasmine.getEnv().execute();
  }
};
