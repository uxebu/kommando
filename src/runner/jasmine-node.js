var jasmine = require('jasmine-node');
var lodash = require('lodash');

module.exports = function(config) {
  var runnerOptions = config.runnerOptions;

  global.kommando = config.kommando;
  config.runnerModules.forEach(function(runnerModule) {
    require(runnerModule);
  });
  jasmine.getEnv().defaultTimeoutInterval = runnerOptions.timeout || (100 * 1000);

  describe(config.kommando.capabilitiesName, function() {
    config.tests.forEach(function(test) {
      require(test);
    });
  });
  return {
    run: function(callback) {
      var onComplete = function(runner, log) {
        var passed = false;
        if (runner.results().failedCount === 0) {
          passed = true;
        }
        callback(null, passed);
      };

      var defaultJasmineOptions = {
        isVerbose: false,
        showColors: true,
        teamcity: false,
        junitreport: {
          report: false,
          savePath : "./reports/",
          useDotNotation: true,
          consolidate: true
        }
      };

      var nonChangeableJasmineOptions = {
        // do not let jasmine-node load the specs!
        specNameMatcher: 'do-not-load-specs',
        specFolders: [],
        onComplete: onComplete
      };

      var options = lodash.merge(
        {}, defaultJasmineOptions, runnerOptions, nonChangeableJasmineOptions
      );

      jasmine.executeSpecsInFolder(options);
    }
  };
};
