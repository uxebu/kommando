var async = require('async');
var lodash = require('lodash');

process.on('message', function(config) {
  var runner = require(config.testRunner);
  var server = require(config.webdriverClient)(config.seleniumUrl);

  server.createClient(config.capabilities, function(error, id, client, data) {
    var kommando = lodash.extend({}, data, {
      client: client,
      server: server,
      capabilities: config.capabilities
    });
    runner.setup({
      kommando: kommando,
      runnerArgs: config.runnerArgs
    });
    runner.run(function(error, passed) {
      var clients = server.getClients();
      var clientQuitFunctions = [];
      for (var key in clients) {
        clientQuitFunctions.push(server.quitClient.bind(server, clients[key]))
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
