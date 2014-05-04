'use strict';

var lodash = require('lodash');
var Mocha = require('mocha');

module.exports = function(config) {
  var mochaInstance;

  var options = lodash.merge({
    globals: ['should', 'kommando'],
    timeout: 10000,
    ignoreLeaks: false,
    ui: 'bdd',
    reporter: 'dot'
  }, config.runnerOptions);

  global.kommando = config.kommando;
  mochaInstance = new Mocha(options);
  mochaInstance.suite.title = config.kommando.capabilitiesName;

  mochaInstance.suite.on('pre-require', function() {
    config.runnerModules.forEach(function(runnerModule) {
      // ensure that we reload every runner-module per spec
      delete require.cache[require.resolve(runnerModule)];
      require(runnerModule);
    });
  });

  config.tests.forEach(function(test) {
    mochaInstance.addFile(test);
  });

  return {
    run: function(callback) {
      mochaInstance.run(function(errCount) {
        callback(null, errCount === 0);
      });
    }
  };

};
