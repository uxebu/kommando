var lodash = require('lodash');
var Mocha = require('mocha');

module.exports = function(config) {
  var mochaInstance;

  var options = lodash.merge({
    globals: ['should', 'kommando'],
    timeout: 10000,
    ignoreLeaks: false,
    ui: 'bdd',
    reporter: 'spec'
  }, config.runnerArgs);

  global.kommando = config.kommando;
  mochaInstance = new Mocha(options);
  mochaInstance.suite.title = config.kommando.capabilities.browserName;

  mochaInstance.suite.on('pre-require', function(context, file, mocha) {
    config.runnerModules.forEach(function(runnerModule) {
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
