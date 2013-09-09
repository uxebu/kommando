var async = require('async');
var runner = require('./runner/jasmine_node');
var serverModule = require('./client/selenium_webdriver.js');
var server;

process.on('message', function(config) {
  server = serverModule(config.seleniumAddress);
  server.createClient(config.capabilities, function(error, id, client, data) {
    runner.setup({
      client: client,
      server: server,
      capabilities: config.capabilities,
      runnerArgs: config.runnerArgs
    });
    runner.run(function(error, passed) {
      /**/
      process.send({
        error: error,
        passed: passed
      });
    });
  });
});

process.on('disconnect', function() {
  var clients = server.getClients();
  var clientQuitFunctions = [];
  for (var key in clients) {
    clientQuitFunctions.push(server.quitClient.bind(server, clients[key]))
  }
  async.series(clientQuitFunctions, function(error) {
    if (error) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
});