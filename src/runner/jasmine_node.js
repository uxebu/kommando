var jasmine = require('jasmine-node');

var SandboxedModule = require('sandboxed-module');

module.exports = {
  setup: function(config) {
    if (config.kommando.server.type === 'selenium-webdriver') {
      require('./jasminewd.js');
    }
    describe(config.kommando.capabilities.browserName, function() {
      for (var i = 0, l = config.runnerArgs.specs.length; i < l; i++) {
        SandboxedModule.require(config.runnerArgs.specs[i], {
          locals: {
            kommando: config.kommando
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
