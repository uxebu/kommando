var async = require('async');
var webdriver = require('selenium-webdriver');

module.exports = function(seleniumUrl) {
  var clients = {};

  return {
    clients: {},
    create: function(capabilities, callback) {
      var client = new webdriver.Builder()
        .usingServer(seleniumUrl)
        .withCapabilities(capabilities)
        .build();

      client.manage().timeouts().setScriptTimeout(100000);
      // TODO: handle errors?
      client.getSession().then(function(session) {
        this.clients[session.getId()] = client;
        callback(null, session.getId(), client, {
          webdriver: webdriver
        });
      }.bind(this));
    },
    end: function(callback) {
      var client;
      var quitFunctions = [];

      var quit = function(client, callback) {
        client.quit().then(function() {
          callback();
        }).then(null, function(error) {
          callback(error);
        });
      };

      for (var id in this.clients) {
        client = this.clients[id];
        delete this.clients[id];
        quitFunctions.push(quit.bind(null, client));
      }
      async.series(quitFunctions, callback);
    }
  }
}
