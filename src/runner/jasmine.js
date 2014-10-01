'use strict';

var Jasmine = require('jasmine');
var lodash = require('lodash');

module.exports = function(config) {
  var jasmine = new Jasmine();

  global.kommando = config.kommando;

  config.runnerModules.forEach(function(runnerModule) {
    require(runnerModule);
  });

  describe(config.kommando.capabilitiesName, function() {
    config.tests.forEach(function(test) {
      require(test);
    });
  });

  return {
    run: function(callback) {
      var options = lodash.merge({}, config.runnerOptions, {
        onComplete: function(passed) {
          callback(null, passed);
        }
      });
      jasmine.configureDefaultReporter(options);
      jasmine.execute();
    }
  };
};
