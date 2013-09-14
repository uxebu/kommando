var async = require('async');
var lodash = require('lodash');

process.on('message', function(config) {
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
    var kommando = lodash.extend({}, data, {
      browser: browser,
      createClient: client.create.bind(client),
      capabilities: config.capabilities
    });
    runner({
      kommando: kommando,
      runnerArgs: config.runnerArgs,
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
});

process.on('disconnect', function() {
  process.exit(0);
});
