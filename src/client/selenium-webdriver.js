var webdriver = require('selenium-webdriver');

module.exports = function(seleniumUrl) {
  var clients = {};

  return {
    createClient: function(capabilities, callback) {
      var client = new webdriver.Builder()
        .usingServer(seleniumUrl)
        .withCapabilities(capabilities)
        .build();

      client.manage().timeouts().setScriptTimeout(100000);
      // TODO: handle errors?
      client.getSession().then(function(session) {
        clients[session.getId()] = client;
        callback(null, session.getId(), client, {
          webdriver: webdriver
        });
      });
    },
    quitClient: function(client, callback) {
      // TODO: handle errors?
      client.getSession().then(function(session) {
        var sessionId = session.getId();
        if (clients[sessionId]) {
          delete clients[sessionId];
          client.quit().then(function() {
            callback();
          });
        }
      });
    },
    getClients: function() {
      return clients;
    }
  }
}
