var async = require('async');
var lodash = require('lodash');

process.on('message', function(config) {
  var runner = require(config.runner);
  var client = require(config.client)(config.seleniumUrl);

  client.createClient(config.capabilities, function(error, id, browser, data) {
    if (error) {
      process.send({
        error: error
      });
      process.exit(1);
      return;
    }
    var kommando = lodash.extend({}, data, {
      browser: browser,
      client: client,
      capabilities: config.capabilities
    });
    runner.setup({
      kommando: kommando,
      tests: config.tests
    });
    runner.run(function(error, passed) {
      var clients = client.getClients();
      var clientQuitFunctions = [];
      for (var key in clients) {
        clientQuitFunctions.push(client.quitClient.bind(client, clients[key]))
      }
      async.series(clientQuitFunctions, function(error) {
        process.send({
          error: error,
          passed: passed,
          clientId: id
        });
      });
    });
  });
});

process.on('disconnect', function() {
  process.exit(0);
});
