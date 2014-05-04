'use strict';

var async = require('async');

module.exports = function(config) {
  global.kommando = config.kommando;

  config.runnerModules.forEach(function(runnerModule) {
    require(runnerModule);
  });

  return {
    run: function(callback) {
      var testFunctions = [];
      var testFunction = function(test, callback) {
        try {
          require(test)(callback);
        } catch (e) {
          callback(e);
        }
      };
      config.tests.forEach(function(test) {
        testFunctions.push(testFunction.bind(null, test));
      });
      async.series(testFunctions, function(error, results) {
        if (error) {
          callback(error, false, results);
        } else {
          callback(null, true, results);
        }
      });
    }
  };

};
