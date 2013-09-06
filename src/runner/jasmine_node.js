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

module.exports = {
  setup: function(config) {
    describe(config.capabilities.browserName, function() {
      for (var i = 0, l = config.runnerArgs.specs.length; i < l; i++) {
        SandboxedModule.require(config.runnerArgs.specs[i], {
          locals: {
            webdriverClient: config.client,
            webdriverServer: config.server,
            webdriver: webdriver
          }
        });
      }
    });
  },
  run: function(callback) {
    var onComplete = function(runner, log) {
      var passed = false;
      if (runner.results().failedCount === 0) {
        passed = true;
      }
      callback(null, passed);
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
      junitreport: {
        report: true,
        savePath : "./reports/",
        useDotNotation: true,
        consolidate: true
      }
    };
    jasmine.executeSpecsInFolder(options);
  }
};
