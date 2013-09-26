var lodash = require('lodash');

process.on('message', function(config) {
  runTests(config);
});

process.on('disconnect', function() {
  process.exit(0);
});

var runTests = function(config) {
  var runner = require(config.runner);
  var client = require(config.client)(config.seleniumUrl);

  client.create(config.capabilities, function(error, browser, data) {
    if (error) {
      process.send({
        error: error
      });
      process.exit(1);
      return;
    }
    var kommando = lodash.extend({}, config.runnerKommandoGlobals, data, {
      browser: browser,
      createBrowser: client.create.bind(client),
      capabilities: config.capabilities
    });
    runner({
      kommando: kommando,
      runnerOptions: config.runnerOptions,
      runnerModules: config.runnerModules,
      tests: config.tests
    }).run(function(error, passed) {
      var clientIds = Object.keys(client.clients);
      client.end(function(error) {
        process.send({
          error: error,
          passed: passed,
          clientIds: clientIds
        });
      });
    });
  });

};
