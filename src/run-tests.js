var lodash = require('lodash');

process.on('message', function(config) {
  runTests(config);
});

var runTests = function(config) {
  var runner = require(config.runner);
  var client = require(config.client)(config.seleniumUrl);

  process.on('uncaughtException', function(exception) {
    // controlling process.exit
    console.error(exception.stack);
    client.end(function(error) {
      if (error) {
        console.error(error.stack);
      }
      process.exit(exception ? 1 : 0);
    });
  });

  client.create(config.capabilities, function(error, browser, data) {
    if (error) {
      console.error(error.stack);
      process.exit(1);
      return;
    }
    var kommando = lodash.extend({}, config.runnerKommandoGlobals, data, {
      browser: browser,
      createBrowser: client.create.bind(client),
      capabilities: config.capabilities,
      capabilitiesName: config.capabilitiesName
    });
    runner({
      kommando: kommando,
      runnerOptions: config.runnerOptions,
      runnerModules: config.runnerModules,
      tests: config.tests
    }).run(function(error, passed) {
      var clientIds = Object.keys(client.clients);
      client.end(function() {
        process.send({
          passed: passed,
          clientIds: clientIds
        });
        if (error) {
          console.error(error.stack);
          process.exit(1);
        } else {
          process.exit(0);
        }
      });
    });
  });

};
